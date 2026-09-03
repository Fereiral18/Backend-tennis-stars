import { SaleResponseDto } from '@/modules/sales/dto/sale-response.dto';

export class DashboardSummaryDto {
  totalProducts: number;
  totalCategories: number;
  totalSales: number;
  totalRevenue: number;
  recentSales: SaleResponseDto[];
}
