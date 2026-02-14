import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@interfaces/lib/prisma';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@interfaces/lib/auth/token';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('access-token')?.value;

        if (!accessToken) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const payload = await verifyAccessToken(accessToken) as {id: string};
        if (!payload || !payload.id) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const { id } = await params;

        const product = await prisma.product.findUnique({
            where: { id: id },
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

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { error: 'Error al obtener producto' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('access-token')?.value;

        if (!accessToken) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const payload = await verifyAccessToken(accessToken) as {id: string};
        if (!payload || !payload.id) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const { id } = await params;
        const rawData = await request.json();

        const { 
            id: _, 
            companyId, 
            createdAt, 
            updatedAt, 
            category, 
            images, 
            prices, 
            codeProduct, 
            codeBarcode, 
            costForUnit, 
            valuePrice, 
            unitOfMeasure,
            taxRate,
            basePrice,
            ...data 
        } = rawData;

        let categoryConnect = undefined;
        
        if (category) {
            const categoryId = typeof category === 'object' && 'id' in category 
                ? (category as any).id 
                : category;
            
            if (typeof categoryId === 'string' && categoryId.includes('-')) {
                const foundCategory = await prisma.categoryProduct.findUnique({
                    where: { id: categoryId },
                    select: { id: true }
                });
                
                if (foundCategory) {
                    categoryConnect = { connect: { id: foundCategory.id } };
                }
            } else {
                const categoryIdString = String(categoryId);
                if (categoryIdString && categoryIdString !== '0') {
                    categoryConnect = { connect: { id: categoryIdString } };
                }
            }
        }

        const product = await prisma.product.update({
            where: { id },
            data: {
                ...data,
                category: categoryConnect,
                code: codeProduct || undefined,
                cost: costForUnit ? String(costForUnit) : undefined,
                taxRate: taxRate != null && taxRate !== '' ? String(taxRate) : undefined,
                finalPrice: valuePrice ? String(valuePrice) : undefined,
                unit: unitOfMeasure || undefined,
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

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { 
                error: 'Error al actualizar producto',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('access-token')?.value;

        if (!accessToken) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const payload = await verifyAccessToken(accessToken) as {id: string};
        if (!payload || !payload.id) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const { id } = await params;

        await prisma.product.delete({
            where: { id: id },
        });

        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { error: 'Error al eliminar producto' },
            { status: 500 }
        );
    }
}