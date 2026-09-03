import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleStatusDto } from './dto/update-sale-status.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.salesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateSaleDto) {
    return this.salesService.create(dto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateSaleStatusDto) {
    return this.salesService.updateStatus(id, dto);
  }

  @Patch(':id/payment-status')
  updatePaymentStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePaymentStatusDto) {
    return this.salesService.updatePaymentStatus(id, dto);
  }
}
