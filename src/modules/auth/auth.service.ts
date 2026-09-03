import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@/prisma/prisma.service';
import type { JwtPayload } from '@/common/types/authenticated-user.interface';
import type { LoginDto } from './dto/login.dto';
import type { AuthResponse, AuthUserResponse } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginDto): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };

    return {
      token: await this.jwtService.signAsync(payload),
      user: { id: user.id, name: user.name, email: user.email },
    };
  }

  async me(userId: string): Promise<AuthUserResponse> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });

    return { id: user.id, name: user.name, email: user.email };
  }
}
