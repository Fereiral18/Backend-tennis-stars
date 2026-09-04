import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  IsUrl,
  Length,
  Max,
  ValidateNested,
} from 'class-validator';
import { Gender } from '@prisma/client';
import { CreateProductOptionDto } from './create-product-option.dto';

export class CreateProductDto {
  @IsString()
  @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
  name!: string;

  @IsString()
  @Length(10, 500, { message: 'La descripción debe tener entre 10 y 500 caracteres' })
  description!: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un número válido' })
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  @Max(999999, { message: 'El precio es demasiado alto' })
  price!: number;

  @IsUrl({ require_tld: false }, { message: 'Ingresá una URL de imagen válida' })
  imageUrl!: string;

  @IsString()
  @Length(2, 50, { message: 'La marca debe tener entre 2 y 50 caracteres' })
  brand!: string;

  @IsEnum(Gender, { message: 'Seleccioná un género válido' })
  gender!: Gender;

  @IsUUID('4', { message: 'Seleccioná una categoría' })
  categoryId!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductOptionDto)
  options?: CreateProductOptionDto[];
}
