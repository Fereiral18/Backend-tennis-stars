import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { PaymentMethod } from '@prisma/client';
import { ShippingInfoDto } from './shipping-info.dto';

export class CreateSaleDto {
  @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
  customerName!: string;

  @IsEmail({}, { message: 'Ingresá un email válido' })
  customerEmail!: string;

  @IsUUID('4', { message: 'Seleccioná un producto' })
  productId!: string;

  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad mínima es 1' })
  @Max(100, { message: 'La cantidad máxima es 100' })
  quantity!: number;

  @IsEnum(PaymentMethod, { message: 'Seleccioná un medio de pago' })
  paymentMethod!: PaymentMethod;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @ValidateNested()
  @Type(() => ShippingInfoDto)
  shipping!: ShippingInfoDto;
}
