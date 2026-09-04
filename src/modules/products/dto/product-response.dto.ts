import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';

export class ProductOptionResponseDto {
  id: string;
  name: string;
  value: string;
}

export class ProductResponseDto {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  brand: string;

  @ApiProperty({ enum: Gender })
  gender: Gender;

  categoryId: string;
  options: ProductOptionResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}
