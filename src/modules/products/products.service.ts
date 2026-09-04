import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma, Product, ProductOption } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { toNumber } from '@/common/utils/decimal.util';
import type { CreateProductDto } from './dto/create-product.dto';
import type { UpdateProductDto } from './dto/update-product.dto';
import type { FindProductsQueryDto } from './dto/find-products.query.dto';
import type { ProductResponseDto } from './dto/product-response.dto';

type ProductWithOptions = Product & { options: ProductOption[] };

const PRODUCT_WITH_OPTIONS = { options: true } satisfies Prisma.ProductInclude;

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
      include: PRODUCT_WITH_OPTIONS,
      orderBy: { createdAt: 'desc' },
    });

    return products.map((product) => ProductsService.toResponse(product));
  }

  async findOne(id: string): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: PRODUCT_WITH_OPTIONS,
    });

    if (!product) {
      throw new NotFoundException('El producto no existe');
    }

    return ProductsService.toResponse(product);
  }

  async create(dto: CreateProductDto): Promise<ProductResponseDto> {
    const { options, ...data } = dto;

    const product = await this.prisma.product.create({
      data: {
        ...data,
        options: { create: options ?? [] },
      },
      include: PRODUCT_WITH_OPTIONS,
    });

    return ProductsService.toResponse(product);
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductResponseDto> {
    await this.findOne(id);

    const { options, ...data } = dto;

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        ...data,
        ...(options && { options: { deleteMany: {}, create: options } }),
      },
      include: PRODUCT_WITH_OPTIONS,
    });

    return ProductsService.toResponse(product);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.prisma.product.delete({ where: { id } });
  }

  private static toResponse(product: ProductWithOptions): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: toNumber(product.price),
      imageUrl: product.imageUrl,
      brand: product.brand,
      gender: product.gender,
      categoryId: product.categoryId,
      options: product.options.map((option) => ({
        id: option.id,
        name: option.name,
        value: option.value,
      })),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
