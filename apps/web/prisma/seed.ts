import { prisma } from '@interfaces/lib/prisma';

async function main() {
    console.log('🌱 Seeding database...');

    // Crear categorías de productos por defecto
    const categories = [
        {
            name: 'General',
            description: 'Categoría general para productos sin clasificación específica',
        },
        {
            name: 'Electrónica',
            description: 'Productos electrónicos y tecnológicos',
        },
        {
            name: 'Ropa y Accesorios',
            description: 'Prendas de vestir y accesorios',
        },
        {
            name: 'Alimentos y Bebidas',
            description: 'Productos alimenticios y bebidas',
        },
        {
            name: 'Hogar y Jardín',
            description: 'Artículos para el hogar y jardinería',
        },
        {
            name: 'Servicios',
            description: 'Servicios profesionales y técnicos',
        },
    ];

    for (const category of categories) {
        await prisma.categoryProduct.upsert({
            where: { id: categories.indexOf(category) + 1 },
            update: {},
            create: {
                ...category,
            },
        });
    }

    console.log('✅ Categorías de productos creadas');
    console.log(`   - ${categories.length} categorías agregadas`);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
