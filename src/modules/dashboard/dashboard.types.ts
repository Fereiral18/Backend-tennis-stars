import type { SaleResponse } from '../sales/sale.types';

export interface DashboardMetrics {
  totalProducts: number;
  totalCategories: number;
  totalSales: number;
  totalRevenue: number;
}

export interface DashboardSummary extends DashboardMetrics {
  recentSales: SaleResponse[];
}
