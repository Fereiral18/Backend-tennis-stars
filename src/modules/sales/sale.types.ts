import type { PaymentMethod, PaymentStatus, SaleStatus } from '@prisma/client';

export interface SaleItemResponse {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ShippingInfoResponse {
  recipientName: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
}

export interface SaleResponse {
  id: string;
  customerName: string;
  customerEmail: string;
  items: SaleItemResponse[];
  total: number;
  status: SaleStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shipping: ShippingInfoResponse;
  createdAt: Date;
  updatedAt: Date;
}
