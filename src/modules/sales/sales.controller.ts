import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '@/common/decorators/roles.decorator';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleStatusDto } from './dto/update-sale-status.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { SaleResponseDto } from './dto/sale-response.dto';
import { CustomerSummaryResponseDto } from './dto/customer-summary-response.dto';

@ApiTags('Sales')
@ApiBearerAuth('access-token')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'List all sales (admin only)' })
  @ApiOkResponse({ description: 'List of sales', type: [SaleResponseDto] })
  @ApiForbiddenResponse({ description: 'Requires ADMIN role' })
  findAll() {
    return this.salesService.findAll();
  }

  @Roles(Role.ADMIN)
  @Get('customers')
  @ApiOperation({
    summary: 'List customers aggregated from sales, with total products purchased (admin only)',
  })
  @ApiOkResponse({ description: 'Customer summary', type: [CustomerSummaryResponseDto] })
  @ApiForbiddenResponse({ description: 'Requires ADMIN role' })
  getCustomerSummary() {
    return this.salesService.getCustomerSummary();
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Get a sale by id (admin only)' })
  @ApiOkResponse({ description: 'The sale', type: SaleResponseDto })
  @ApiNotFoundResponse({ description: 'Sale not found' })
  @ApiForbiddenResponse({ description: 'Requires ADMIN role' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.salesService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary:
      'Create a sale for a single product (any authenticated user; price/subtotal computed server-side)',
  })
  @ApiCreatedResponse({ description: 'Sale created', type: SaleResponseDto })
  @ApiNotFoundResponse({ description: 'Product not found' })
  create(@Body() dto: CreateSaleDto) {
    return this.salesService.create(dto);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/status')
  @ApiOperation({ summary: 'Update the fulfillment status of a sale (admin only)' })
  @ApiOkResponse({ description: 'Sale updated', type: SaleResponseDto })
  @ApiNotFoundResponse({ description: 'Sale not found' })
  @ApiForbiddenResponse({ description: 'Requires ADMIN role' })
  updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateSaleStatusDto) {
    return this.salesService.updateStatus(id, dto);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/payment-status')
  @ApiOperation({ summary: 'Update the payment status of a sale (admin only)' })
  @ApiOkResponse({ description: 'Sale updated', type: SaleResponseDto })
  @ApiNotFoundResponse({ description: 'Sale not found' })
  @ApiForbiddenResponse({ description: 'Requires ADMIN role' })
  updatePaymentStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePaymentStatusDto) {
    return this.salesService.updatePaymentStatus(id, dto);
  }
}
