import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@interfaces/lib/prisma';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@interfaces/lib/auth/token';
import { ItemType, UnitOfMeansureList } from '@prisma/client';

/**
 * GET /api/products
 * Obtiene el listado de productos de la empresa
 */
export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('access-token')?.value;

        if (!accessToken) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const payload = await verifyAccessToken(accessToken) as { id: string };;
        if (!payload || !payload.id) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: payload.id },
            include: { company: true },
        });

        if (!user || !user.company) {
            return NextResponse.json({ error: 'User or company not found' }, { status: 404 });
        }

        const products = await prisma.product.findMany({
            where: {
                companyId: user.company.id,
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
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(products);
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
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('access-token')?.value;

        if (!accessToken) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const payload = await verifyAccessToken(accessToken) as { id: string };;
        if (!payload || !payload.id) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: payload.id },
            include: { company: true },
        });

        if (!user || !user.company) {
            return NextResponse.json({ error: 'User or company not found' }, { status: 404 });
        }

        const rawData = await request.json();

        const {
            id,
            companyId,
            createdAt,
            updatedAt,
            category,
            images,
            prices,
            initialStock,
            unitOfMeasure,
            codeProduct,
            codeBarcode,
            costForUnit,
            valuePrice,
            initialAmount,
            store,
            priceList,
            bills,
            goodExcluded,
            taxExempt,
            observation,
            basePrice,
            type,
            ...data
        } = rawData;

        const categoryId = category && typeof category === 'object' && 'id' in category
            ? (category as any).id
            : category;
        const parsedCategoryId = categoryId;

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
                companyId: user.company.id,
                type: type || ItemType.PRODUCT,
                unit: unitOfMeasure || UnitOfMeansureList.UNIDAD,
                categoryProductId: categoryId,
                code: codeProduct,
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
