import { IsNumber, IsPositive, IsString, IsUUID, IsUrl, Length, Max } from 'class-validator';

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

  @IsUrl({}, { message: 'Ingresá una URL de imagen válida' })
  imageUrl!: string;

  @IsUUID('4', { message: 'Seleccioná una categoría' })
  categoryId!: string;
}
