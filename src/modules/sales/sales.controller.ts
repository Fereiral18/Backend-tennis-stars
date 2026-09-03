import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleStatusDto } from './dto/update-sale-status.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { SaleResponseDto } from './dto/sale-response.dto';

@ApiTags('Sales')
@ApiBearerAuth('access-token')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  @ApiOperation({ summary: 'List all sales' })
  @ApiOkResponse({ description: 'List of sales', type: [SaleResponseDto] })
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a sale by id' })
  @ApiOkResponse({ description: 'The sale', type: SaleResponseDto })
  @ApiNotFoundResponse({ description: 'Sale not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.salesService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a sale for a single product (price/subtotal computed server-side)',
  })
  @ApiCreatedResponse({ description: 'Sale created', type: SaleResponseDto })
  @ApiNotFoundResponse({ description: 'Product not found' })
  create(@Body() dto: CreateSaleDto) {
    return this.salesService.create(dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update the fulfillment status of a sale' })
  @ApiOkResponse({ description: 'Sale updated', type: SaleResponseDto })
  @ApiNotFoundResponse({ description: 'Sale not found' })
  updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateSaleStatusDto) {
    return this.salesService.updateStatus(id, dto);
  }

  @Patch(':id/payment-status')
  @ApiOperation({ summary: 'Update the payment status of a sale' })
  @ApiOkResponse({ description: 'Sale updated', type: SaleResponseDto })
  @ApiNotFoundResponse({ description: 'Sale not found' })
  updatePaymentStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePaymentStatusDto) {
    return this.salesService.updatePaymentStatus(id, dto);
  }
}
