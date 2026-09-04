import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import type { JwtPayload } from '@/common/types/authenticated-user.interface';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';
import type { ResetPasswordDto } from './dto/reset-password.dto';
import type { VerifySecurityAnswersDto } from './dto/verify-security-answers.dto';
import type { LoginResponseDto } from './dto/login-response.dto';
import type { AuthUserResponseDto } from './dto/auth-user-response.dto';
import type { VerificationTokenResponseDto } from './dto/verification-token-response.dto';

const SALT_ROUNDS = 10;
const RESET_TOKEN_PURPOSE = 'password-reset';
const RESET_TOKEN_EXPIRES_IN = '5m';

const SECURITY_ANSWERS = {
  companyName: 'tennis',
  role: 'admin',
};

interface ResetTokenPayload {
  purpose: typeof RESET_TOKEN_PURPOSE;
}

function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase();
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginDto): Promise<LoginResponseDto> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    return this.buildLoginResponse(user);
  }

  async register(dto: RegisterDto): Promise<LoginResponseDto> {
    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: Role.USER,
      },
    });

    return this.buildLoginResponse(user);
  }

  async verifySecurityAnswers(
    dto: VerifySecurityAnswersDto,
  ): Promise<VerificationTokenResponseDto> {
    const isValid =
      normalizeAnswer(dto.companyName) === SECURITY_ANSWERS.companyName &&
      normalizeAnswer(dto.role) === SECURITY_ANSWERS.role;

    if (!isValid) {
      throw new UnauthorizedException('Las respuestas de seguridad son incorrectas');
    }

    const payload: ResetTokenPayload = { purpose: RESET_TOKEN_PURPOSE };

    const verificationToken = await this.jwtService.signAsync(payload, {
      expiresIn: RESET_TOKEN_EXPIRES_IN,
    });

    return { verificationToken };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    this.assertValidResetToken(dto.verificationToken);

    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    const admin = await this.prisma.user.findFirst({ where: { role: Role.ADMIN } });

    if (!admin) {
      throw new NotFoundException('No existe un usuario administrador');
    }

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    await this.prisma.user.update({
      where: { id: admin.id },
      data: { password: hashedPassword },
    });
  }

  async me(userId: string): Promise<AuthUserResponseDto> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });

    return { id: user.id, name: user.name, email: user.email };
  }

  private assertValidResetToken(token: string): void {
    try {
      const payload = this.jwtService.verify<ResetTokenPayload>(token);

      if (payload.purpose !== RESET_TOKEN_PURPOSE) {
        throw new Error('wrong purpose');
      }
    } catch {
      throw new UnauthorizedException('Token de verificación inválido o expirado');
    }
  }

  private async buildLoginResponse(user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  }): Promise<LoginResponseDto> {
    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };

    return {
      token: await this.jwtService.signAsync(payload),
      user: { id: user.id, name: user.name, email: user.email },
    };
  }
}
