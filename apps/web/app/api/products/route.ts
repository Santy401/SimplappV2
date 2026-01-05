import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@interfaces/lib/prisma';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@interfaces/lib/auth/token';
import { ItemType, UnitOfMeansureList } from '@prisma/client';

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('access-token')?.value;

        if (!accessToken) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const payload = await verifyAccessToken(accessToken);
        if (!payload || !payload.id) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: Number(payload.id) },
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

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('access-token')?.value;

        if (!accessToken) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const payload = await verifyAccessToken(accessToken);
        if (!payload || !payload.id) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: Number(payload.id) },
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

        const categoryId = category && typeof category === 'object' && 'id' in category ? (category as any).id : category;
        const parsedCategoryId = Number(categoryId);

        const product = await prisma.product.create({
            data: {
                ...data,
                description: data.description || observation,
                company: {
                    connect: { id: user.company.id },
                },
                type: type || ItemType.PRODUCT,
                unit: unitOfMeasure || UnitOfMeansureList.UNIDAD,
                category: {
                    connect: {
                        id: !isNaN(parsedCategoryId) && parsedCategoryId !== 0 ? parsedCategoryId : undefined,
                    },
                },
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
        return NextResponse.json(
            { error: 'Error al crear producto' },
            { status: 500 }
        );
    }
}
