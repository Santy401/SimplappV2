import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../apps/web/.env') });

async function main() {
    const { prisma } = await import('../../packages/interfaces/lib/prisma');

    const targetEmail = 'santiprocastellar7@gmail.com';
    console.log(`🚀 Iniciando seeder de PRODUCTOS para: ${targetEmail}`);

    const user = await prisma.user.findUnique({
        where: { email: targetEmail },
        include: { companies: { include: { company: true } } }
    });

    if (!user || user.companies.length === 0) {
        console.error(`❌ Error: No se encontró al usuario ${targetEmail}.`);
        return;
    }

    const company = user.companies[0].company;

    // Obtener una categoría base (o la creamos si no existe, basándonos en el de categorías)
    let category = await prisma.categoryProduct.findFirst({
        where: { companyId: company.id }
    });

    if (!category) {
        console.log('⚠️ No hay categorías para asociar, creando una Categoría Base...');
        category = await prisma.categoryProduct.create({
            data: {
                name: 'Productos Base',
                description: 'Categoría para productos del seeder',
                companyId: company.id
            }
        });
    }

    console.log('📦 Creando 50 productos...');
    const productsData = Array.from({ length: 50 }).map((_, i) => ({
        name: `Producto Base ${i + 1}`,
        code: `BASE-SKU-${1000 + i}`,
        reference: `REF-BASE-${i}`,
        type: 'PRODUCT',
        unit: 'UNIDAD',
        taxRate: '19',
        cost: 5000 + (i * 100),
        basePrice: 10000 + (i * 150),
        finalPrice: 11900 + (i * 178.5),
        companyId: company.id,
        categoryProductId: category.id
    }));

    try {
        await prisma.product.createMany({ data: productsData, skipDuplicates: true });
    } catch (e) {
        console.log('   ⚠️ Algunos productos ya existen, continuando...');
    }

    console.log('✅ Seeder de productos completado.');
}

main()
    .catch((e) => {
        console.error('❌ Error en seeder de productos:', e);
        process.exit(1);
    })
    .finally(async () => {
        const { prisma } = await import('../../packages/interfaces/lib/prisma');
        await prisma.$disconnect();
    });
