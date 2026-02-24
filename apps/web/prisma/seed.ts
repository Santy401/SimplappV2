import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '..', '.env') });


async function main() {
    const { prisma } = await import('@interfaces/lib/prisma');
    console.log('🌱 Seeding database...');

    const categories = [
        { name: 'General', description: 'Categoría general para productos sin clasificación específica' },
        { name: 'Electrónica', description: 'Productos electrónicos y tecnológicos' },
        { name: 'Ropa y Accesorios', description: 'Prendas de vestir y accesorios' },
        { name: 'Alimentos y Bebidas', description: 'Productos alimenticios y bebidas' },
        { name: 'Hogar y Jardín', description: 'Artículos para el hogar y jardinería' },
        { name: 'Servicios', description: 'Servicios profesionales y técnicos' },
    ];

    console.log(`📦 Creando ${categories.length} categorías...`);

    const defaultCompany = await prisma.company.findFirst();
    if (!defaultCompany) {
        console.log('⚠️ No company found. Please create a company first before seeding categories.');
        return;
    }

    for (const category of categories) {
        const existing = await prisma.categoryProduct.findFirst({
            where: { name: category.name, companyId: defaultCompany.id }
        });

        if (!existing) {
            const created = await prisma.categoryProduct.create({
                data: { ...category, companyId: defaultCompany.id },
            });
            console.log(`   ✅ ${created.name}`);
        } else {
            console.log(`   ⏭️ ${category.name} (ya existe)`);
        }
    }

    console.log(`\n🎉 Seed completado exitosamente!`);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        const { prisma } = await import('@interfaces/lib/prisma');
        await prisma.$disconnect();
    });
