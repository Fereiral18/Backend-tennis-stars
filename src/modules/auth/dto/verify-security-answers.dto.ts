import { IsString, MinLength } from 'class-validator';

export class VerifySecurityAnswersDto {
  @IsString()
  @MinLength(1, { message: 'Ingresá el nombre de la empresa' })
  companyName!: string;

  @IsString()
  @MinLength(1, { message: 'Ingresá el rol' })
  role!: string;
}
