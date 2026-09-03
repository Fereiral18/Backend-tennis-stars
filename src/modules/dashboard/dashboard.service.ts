import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { toNumber } from '@/common/utils/decimal.util';
import { SalesService } from '../sales/sales.service';
import type { DashboardSummary } from './dashboard.types';

const RECENT_SALES_LIMIT = 5;

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly salesService: SalesService,
  ) {}

  async getSummary(): Promise<DashboardSummary> {
    const [totalProducts, totalCategories, totalSales, revenue, recentSales] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.category.count(),
      this.prisma.sale.count(),
      this.prisma.sale.aggregate({ _sum: { total: true } }),
      this.salesService.findRecent(RECENT_SALES_LIMIT),
    ]);

    return {
      totalProducts,
      totalCategories,
      totalSales,
      totalRevenue: toNumber(revenue._sum.total ?? 0),
      recentSales,
    };
  }
}
