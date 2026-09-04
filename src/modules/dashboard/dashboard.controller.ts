import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '@/common/decorators/roles.decorator';
import { DashboardService } from './dashboard.service';
import { DashboardSummaryDto } from './dto/dashboard-summary.dto';

@ApiTags('Dashboard')
@ApiBearerAuth('access-token')
@Roles(Role.ADMIN)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get aggregated metrics and the 5 most recent sales (admin only)' })
  @ApiOkResponse({ description: 'Dashboard summary', type: DashboardSummaryDto })
  @ApiForbiddenResponse({ description: 'Requires ADMIN role' })
  getSummary() {
    return this.dashboardService.getSummary();
  }
}
