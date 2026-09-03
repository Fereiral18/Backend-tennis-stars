import { IsEnum } from 'class-validator';
import { PaymentStatus } from '@prisma/client';

export class UpdatePaymentStatusDto {
  @IsEnum(PaymentStatus, { message: 'Estado de pago inválido' })
  paymentStatus!: PaymentStatus;
}
