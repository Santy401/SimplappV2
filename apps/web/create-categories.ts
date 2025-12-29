import { prisma } from '@interfaces/lib/prisma';

async function main() {
    console.log('🌱 Creating product categories...');

    const categories = [
        { name: 'General', description: 'Categoría general para productos sin clasificación específica' },
        { name: 'Electrónica', description: 'Productos electrónicos y tecnológicos' },
        { name: 'Ropa y Accesorios', description: 'Prendas de vestir y accesorios' },
        { name: 'Alimentos y Bebidas', description: 'Productos alimenticios y bebidas' },
        { name: 'Hogar y Jardín', description: 'Artículos para el hogar y jardinería' },
        { name: 'Servicios', description: 'Servicios profesionales y técnicos' },
    ];

    for (const category of categories) {
        try {
            await prisma.categoryProduct.create({
                data: category,
            });
            console.log(`✅ Created category: ${category.name}`);
        } catch (error: any) {
            if (error.code === 'P2002') {
                console.log(`⚠️  Category already exists: ${category.name}`);
            } else {
                console.error(`❌ Error creating category ${category.name}:`, error.message);
            }
        }
    }

    console.log('✅ Categories creation completed');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
