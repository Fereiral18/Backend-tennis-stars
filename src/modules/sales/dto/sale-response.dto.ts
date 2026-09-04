import { ApiProperty } from '@nestjs/swagger';
import { Gender, PaymentMethod, PaymentStatus, SaleStatus } from '@prisma/client';

export class SaleItemResponseDto {
  productId: string;
  productName: string;

  @ApiProperty({ enum: Gender })
  gender: Gender;

  color: string | null;
  size: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export class ShippingResponseDto {
  recipientName: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
}

export class SaleResponseDto {
  id: string;
  customerName: string;
  customerEmail: string;
  items: SaleItemResponseDto[];
  total: number;

  @ApiProperty({ enum: SaleStatus })
  status: SaleStatus;

  @ApiProperty({ enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @ApiProperty({ enum: PaymentStatus })
  paymentStatus: PaymentStatus;

  shipping: ShippingResponseDto;
  createdAt: Date;
  updatedAt: Date;
}
