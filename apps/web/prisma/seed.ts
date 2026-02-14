import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '..', '.env') });

import { prisma } from '@interfaces/lib/prisma';

async function main() {
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

    for (const category of categories) {
        const created = await prisma.categoryProduct.create({
            data: category,
        });
        console.log(`   ✅ ${created.name}`);
    }

    console.log(`\n🎉 Seed completado exitosamente!`);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
