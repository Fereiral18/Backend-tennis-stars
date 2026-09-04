import { IsIn, IsString, MinLength } from 'class-validator';

export const PRODUCT_OPTION_NAMES = ['Color', 'Talla'] as const;
export type ProductOptionName = (typeof PRODUCT_OPTION_NAMES)[number];

export class CreateProductOptionDto {
  @IsIn(PRODUCT_OPTION_NAMES, { message: 'La opción debe ser Color o Talla' })
  name!: ProductOptionName;

  @IsString()
  @MinLength(1, { message: 'Ingresá un valor para la opción' })
  value!: string;
}
