import { Injectable, NotFoundException } from '@nestjs/common';
import type { Product, Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { toNumber } from '@/common/utils/decimal.util';
import type { CreateProductDto } from './dto/create-product.dto';
import type { UpdateProductDto } from './dto/update-product.dto';
import type { FindProductsQueryDto } from './dto/find-products.query.dto';
import type { ProductResponseDto } from './dto/product-response.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: FindProductsQueryDto): Promise<ProductResponseDto[]> {
    const where: Prisma.ProductWhereInput = {
      ...(query.categoryId && { categoryId: query.categoryId }),
      ...(query.search && {
        name: { contains: query.search, mode: 'insensitive' },
      }),
    };

    const products = await this.prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return products.map((product) => ProductsService.toResponse(product));
  }

  async findOne(id: string): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException('El producto no existe');
    }

    return ProductsService.toResponse(product);
  }

  async create(dto: CreateProductDto): Promise<ProductResponseDto> {
    const product = await this.prisma.product.create({ data: dto });

    return ProductsService.toResponse(product);
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductResponseDto> {
    await this.findOne(id);

    const product = await this.prisma.product.update({ where: { id }, data: dto });

    return ProductsService.toResponse(product);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.prisma.product.delete({ where: { id } });
  }

  private static toResponse(product: Product): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: toNumber(product.price),
      imageUrl: product.imageUrl,
      categoryId: product.categoryId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
