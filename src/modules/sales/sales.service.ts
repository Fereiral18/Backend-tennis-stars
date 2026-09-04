import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { toNumber } from '@/common/utils/decimal.util';
import type { CreateSaleDto } from './dto/create-sale.dto';
import type { UpdateSaleStatusDto } from './dto/update-sale-status.dto';
import type { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import type { SaleResponseDto } from './dto/sale-response.dto';
import type { CustomerSummaryResponseDto } from './dto/customer-summary-response.dto';

type SaleWithItems = Prisma.SaleGetPayload<{ include: { items: true } }>;

const SALE_WITH_ITEMS = { items: true } satisfies Prisma.SaleInclude;

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<SaleResponseDto[]> {
    const sales = await this.prisma.sale.findMany({
      include: SALE_WITH_ITEMS,
      orderBy: { createdAt: 'desc' },
    });

    return sales.map((sale) => SalesService.toResponse(sale));
  }

  async findOne(id: string): Promise<SaleResponseDto> {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: SALE_WITH_ITEMS,
    });

    if (!sale) {
      throw new NotFoundException('La venta no existe');
    }

    return SalesService.toResponse(sale);
  }

  async create(dto: CreateSaleDto): Promise<SaleResponseDto> {
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
              gender: product.gender,
              color: dto.color,
              size: dto.size,
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

  async findRecent(limit: number): Promise<SaleResponseDto[]> {
    const sales = await this.prisma.sale.findMany({
      include: SALE_WITH_ITEMS,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return sales.map((sale) => SalesService.toResponse(sale));
  }

  async getCustomerSummary(): Promise<CustomerSummaryResponseDto[]> {
    const sales = await this.prisma.sale.findMany({
      select: {
        customerName: true,
        customerEmail: true,
        items: { select: { quantity: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const byEmail = new Map<string, CustomerSummaryResponseDto>();

    for (const sale of sales) {
      const productsInSale = sale.items.reduce((sum, item) => sum + item.quantity, 0);
      const existing = byEmail.get(sale.customerEmail);

      if (existing) {
        existing.totalOrders += 1;
        existing.totalProductsPurchased += productsInSale;
      } else {
        byEmail.set(sale.customerEmail, {
          customerName: sale.customerName,
          customerEmail: sale.customerEmail,
          totalOrders: 1,
          totalProductsPurchased: productsInSale,
        });
      }
    }

    return Array.from(byEmail.values()).sort(
      (a, b) => b.totalProductsPurchased - a.totalProductsPurchased,
    );
  }

  async updateStatus(id: string, dto: UpdateSaleStatusDto): Promise<SaleResponseDto> {
    await this.findOne(id);

    const sale = await this.prisma.sale.update({
      where: { id },
      data: { status: dto.status },
      include: SALE_WITH_ITEMS,
    });

    return SalesService.toResponse(sale);
  }

  async updatePaymentStatus(id: string, dto: UpdatePaymentStatusDto): Promise<SaleResponseDto> {
    await this.findOne(id);

    const sale = await this.prisma.sale.update({
      where: { id },
      data: { paymentStatus: dto.paymentStatus },
      include: SALE_WITH_ITEMS,
    });

    return SalesService.toResponse(sale);
  }

  private static toResponse(sale: SaleWithItems): SaleResponseDto {
    return {
      id: sale.id,
      customerName: sale.customerName,
      customerEmail: sale.customerEmail,
      items: sale.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        gender: item.gender,
        color: item.color,
        size: item.size,
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
