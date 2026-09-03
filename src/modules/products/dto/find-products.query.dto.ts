import { IsOptional, IsString, IsUUID } from 'class-validator';

export class FindProductsQueryDto {
  @IsOptional()
  @IsUUID('4')
  categoryId?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
