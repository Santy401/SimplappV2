import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@interfaces/lib/prisma';
import { ItemType, UnitOfMeansureList } from '@prisma/client';
import { getPaginationParams, buildMeta } from '@/lib/pagination';
import { getAuthContext } from '@interfaces/lib/auth/session';


/**
 * GET /api/products
 * Obtiene el listado de productos de la empresa
 */
export async function GET(request: NextRequest) {
    try {
        const auth = await getAuthContext();
        if (!auth) {
            return NextResponse.json({ error: 'No autorizado o empresa no encontrada' }, { status: 401 });
        }

        const { companyId } = auth;
        const { page, take, skip } = getPaginationParams(request);
        const searchQuery = request.nextUrl.searchParams.get('search') ?? undefined;
        const categoryId = request.nextUrl.searchParams.get('category') ?? undefined;

        const where = {
            companyId,
            deletedAt: null,
            ...(categoryId && { categoryProductId: categoryId }),
            ...(searchQuery && {
                OR: [
                    { name: { contains: searchQuery, mode: 'insensitive' as const } },
                    { reference: { contains: searchQuery, mode: 'insensitive' as const } },
                    { code: { contains: searchQuery, mode: 'insensitive' as const } },
                ],
            }),
        };

        const include = {
            category: true,
            images: true,
            prices: { include: { listPrice: true } },
            store: true,
        };

        const [products, total] = await prisma.$transaction([
            prisma.product.findMany({ where, skip, take, include, orderBy: { createdAt: 'desc' } }),
            prisma.product.count({ where }),
        ]);

        return NextResponse.json({ data: products, meta: buildMeta(page, take, total) });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Error al obtener productos' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/products
 * Crea un nuevo producto
 */
export async function POST(request: NextRequest) {
    try {
        const auth = await getAuthContext();
        if (!auth) {
            return NextResponse.json({ error: 'No autorizado o empresa no encontrada' }, { status: 401 });
        }

        const { companyId } = auth;

        const rawData = await request.json();

        const {
            id: _id,
            createdAt: _createdAt,
            updatedAt: _updatedAt,
            category,
            images: _images,
            prices: _prices,
            initialStock: _initialStock,
            unitOfMeasure,
            codeProduct,
            codeBarcode: _codeBarcode,
            costForUnit,
            valuePrice,
            initialAmount,
            store: _store,
            storeId,
            priceList: _priceList,
            bills: _bills,
            goodExcluded: _goodExcluded,
            taxExempt: _taxExempt,
            observation,
            basePrice,
            type,
            ...data
        } = rawData;

        const categoryId = category && typeof category === 'object' && 'id' in category
            ? (category as any).id
            : category;

        if (!categoryId || typeof categoryId !== 'string') {
            return NextResponse.json(
                { error: 'categoryId es requerido y debe ser un UUID válido' },
                { status: 400 }
            );
        }

        const product = await prisma.product.create({
            data: {
                ...data,
                description: data.description || observation,
                companyId,
                type: type || ItemType.PRODUCT,
                unit: unitOfMeasure || UnitOfMeansureList.UNIDAD,
                categoryProductId: categoryId,
                code: codeProduct,
                storeId: storeId && storeId !== "" ? storeId : undefined,
                cost: costForUnit ? String(costForUnit) : undefined,
                basePrice: basePrice ? String(basePrice) : undefined,
                finalPrice: valuePrice ? String(valuePrice) : undefined,
            },
            include: {
                category: true,
                images: true,
                prices: {
                    include: {
                        listPrice: true,
                    },
                },
            },
        });

        // Crear movimiento de inventario inicial si se especifica
        if (storeId && initialAmount && Number(initialAmount) > 0) {
            try {
                await prisma.inventoryMovement.create({
                    data: {
                        productId: product.id,
                        storeId: storeId,
                        quantity: Number(initialAmount),
                        type: 'IN',
                    }
                });
            } catch (inventoryError) {
                console.error('Error creating initial inventory movement:', inventoryError);
                // No fallamos el proceso principal si solo falla el inventario inicial
            }
        }

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: 'Error al crear producto' },
            { status: 500 }
        );
    }
}
