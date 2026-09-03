import { IsEnum } from 'class-validator';
import { SaleStatus } from '@prisma/client';

export class UpdateSaleStatusDto {
  @IsEnum(SaleStatus, { message: 'Estado de venta inválido' })
  status!: SaleStatus;
}
