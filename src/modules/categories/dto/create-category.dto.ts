import { IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @Length(2, 50, { message: 'El nombre debe tener entre 2 y 50 caracteres' })
  name!: string;

  @IsString()
  @Length(5, 200, { message: 'La descripción debe tener entre 5 y 200 caracteres' })
  description!: string;
}
