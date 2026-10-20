import { prisma } from '../../config/prisma';
import { AppError } from '../../utils/AppError';
import { Size } from '@prisma/client';

export interface CreateProductInput {
  title: string;
  slug?: string;
  description: string;
  basePrice: number;
  categoryId?: string | null;
  countryOfOrigin?: string;
  fabricCare?: string | null;
  imageUrl?: string | null;
  variants: {
    sku: string;
    size: Size;
    colorName: string;
    colorHex?: string;
    stockCount: number;
    images?: string[];
  }[];
}

export class CatalogService {
  async getAllProducts(filters?: { categorySlug?: string; search?: string }) {
    const whereClause: any = { isPublished: true };

    if (filters?.categorySlug) {
      whereClause.category = { slug: filters.categorySlug };
    }

    if (filters?.search) {
      whereClause.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        variants: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProductById(identifier: string) {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
      include: {
        category: true,
        variants: true,
      },
    });

    if (!product) {
      throw new AppError(`Product with ID/slug '${identifier}' was not found`, 404);
    }

    return product;
  }

  async createProduct(data: CreateProductInput) {
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      throw new AppError(`A garment with slug '${slug}' already exists`, 409);
    }

    return await prisma.product.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        basePrice: data.basePrice,
        categoryId: data.categoryId || null,
        countryOfOrigin: data.countryOfOrigin || 'India',
        fabricCare: data.fabricCare || null,
        imageUrl: data.imageUrl || null,
        variants: {
          create: data.variants.map((v) => ({
            sku: v.sku,
            size: v.size,
            colorName: v.colorName,
            colorHex: v.colorHex || '#000000',
            stockCount: v.stockCount,
            images: v.images || [],
          })),
        },
      },
      include: {
        category: true,
        variants: true,
      },
    });
  }

  async deleteProduct(id: string) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new AppError(`Product with ID '${id}' not found`, 404);
    }

    await prisma.product.delete({ where: { id } });
    return { id, message: 'Product successfully deleted from catalog' };
  }
}

export const catalogService = new CatalogService();
