import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Falta el token de verificación' })
  verificationToken!: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;

  @IsString()
  @MinLength(6, { message: 'La confirmación debe tener al menos 6 caracteres' })
  confirmPassword!: string;
}
