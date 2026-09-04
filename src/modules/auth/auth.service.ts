import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import type { JwtPayload } from '@/common/types/authenticated-user.interface';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';
import type { LoginResponseDto } from './dto/login-response.dto';
import type { AuthUserResponseDto } from './dto/auth-user-response.dto';

const SALT_ROUNDS = 10;

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

  async me(userId: string): Promise<AuthUserResponseDto> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });

    return { id: user.id, name: user.name, email: user.email };
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
