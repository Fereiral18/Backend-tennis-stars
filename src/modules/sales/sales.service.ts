import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { toNumber } from '@/common/utils/decimal.util';
import type { CreateSaleDto } from './dto/create-sale.dto';
import type { UpdateSaleStatusDto } from './dto/update-sale-status.dto';
import type { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import type { SaleResponse } from './sale.types';

type SaleWithItems = Prisma.SaleGetPayload<{ include: { items: true } }>;

const SALE_WITH_ITEMS = { items: true } satisfies Prisma.SaleInclude;

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<SaleResponse[]> {
    const sales = await this.prisma.sale.findMany({
      include: SALE_WITH_ITEMS,
      orderBy: { createdAt: 'desc' },
    });

    return sales.map((sale) => SalesService.toResponse(sale));
  }

  async findOne(id: string): Promise<SaleResponse> {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: SALE_WITH_ITEMS,
    });

    if (!sale) {
      throw new NotFoundException('La venta no existe');
    }

    return SalesService.toResponse(sale);
  }

  async create(dto: CreateSaleDto): Promise<SaleResponse> {
    const product = await this.prisma.product.findUnique({ where: { id: dto.productId } });

    if (!product) {
      throw new NotFoundException('El producto seleccionado no existe');
    }

    const unitPrice = toNumber(product.price);
    const subtotal = unitPrice * dto.quantity;

    const sale = await this.prisma.sale.create({
      data: {
        customerName: dto.customerName,
        customerEmail: dto.customerEmail,
        paymentMethod: dto.paymentMethod,
        total: subtotal,
        recipientName: dto.shipping.recipientName,
        address: dto.shipping.address,
        city: dto.shipping.city,
        province: dto.shipping.province,
        postalCode: dto.shipping.postalCode,
        phone: dto.shipping.phone,
        items: {
          create: [
            {
              productId: product.id,
              productName: product.name,
              quantity: dto.quantity,
              unitPrice,
              subtotal,
            },
          ],
        },
      },
      include: SALE_WITH_ITEMS,
    });

    return SalesService.toResponse(sale);
  }

  async findRecent(limit: number): Promise<SaleResponse[]> {
    const sales = await this.prisma.sale.findMany({
      include: SALE_WITH_ITEMS,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return sales.map((sale) => SalesService.toResponse(sale));
  }

  async updateStatus(id: string, dto: UpdateSaleStatusDto): Promise<SaleResponse> {
    await this.findOne(id);

    const sale = await this.prisma.sale.update({
      where: { id },
      data: { status: dto.status },
      include: SALE_WITH_ITEMS,
    });

    return SalesService.toResponse(sale);
  }

  async updatePaymentStatus(id: string, dto: UpdatePaymentStatusDto): Promise<SaleResponse> {
    await this.findOne(id);

    const sale = await this.prisma.sale.update({
      where: { id },
      data: { paymentStatus: dto.paymentStatus },
      include: SALE_WITH_ITEMS,
    });

    return SalesService.toResponse(sale);
  }

  private static toResponse(sale: SaleWithItems): SaleResponse {
    return {
      id: sale.id,
      customerName: sale.customerName,
      customerEmail: sale.customerEmail,
      items: sale.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: toNumber(item.unitPrice),
        subtotal: toNumber(item.subtotal),
      })),
      total: toNumber(sale.total),
      status: sale.status,
      paymentMethod: sale.paymentMethod,
      paymentStatus: sale.paymentStatus,
      shipping: {
        recipientName: sale.recipientName,
        address: sale.address,
        city: sale.city,
        province: sale.province,
        postalCode: sale.postalCode,
        phone: sale.phone,
      },
      createdAt: sale.createdAt,
      updatedAt: sale.updatedAt,
    };
  }
}
