import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from '@/common/decorators/public.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@/common/types/authenticated-user.interface';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifySecurityAnswersDto } from './dto/verify-security-answers.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthUserResponseDto } from './dto/auth-user-response.dto';
import { VerificationTokenResponseDto } from './dto/verification-token-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Log in with email and password' })
  @ApiOkResponse({ description: 'Login succeeded', type: LoginResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new account (created with the USER role)' })
  @ApiCreatedResponse({ description: 'Account created and logged in', type: LoginResponseDto })
  @ApiConflictResponse({ description: 'Email already registered' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('verify-security-answers')
  @ApiOperation({ summary: 'Verify the security questions before resetting the password' })
  @ApiOkResponse({ description: 'Answers correct', type: VerificationTokenResponseDto })
  @ApiUnauthorizedResponse({ description: 'Incorrect answers' })
  verifySecurityAnswers(@Body() dto: VerifySecurityAnswersDto) {
    return this.authService.verifySecurityAnswers(dto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Patch('reset-password')
  @ApiOperation({
    summary: "Reset the admin account's password (requires a valid verificationToken)",
  })
  @ApiOkResponse({ description: 'Password updated' })
  @ApiNotFoundResponse({ description: 'No admin user exists' })
  @ApiUnauthorizedResponse({ description: 'Missing or expired verification token' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get the currently authenticated user' })
  @ApiOkResponse({ description: 'Current user', type: AuthUserResponseDto })
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.me(user.id);
  }
}
