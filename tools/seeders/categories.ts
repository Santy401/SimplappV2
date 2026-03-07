import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../apps/web/.env') });

async function main() {
    const { prisma } = await import('../../packages/interfaces/lib/prisma');


    const targetEmail = 'santiprocastellar7@gmail.com';
    console.log(`🚀 Iniciando seeder de CATEGORÍAS para: ${targetEmail}`);

    const user = await prisma.user.findUnique({
        where: { email: targetEmail },
        include: { companies: { include: { company: true } } }
    });

    if (!user || user.companies.length === 0) {
        console.error(`❌ Error: No se encontró al usuario ${targetEmail} o no tiene empresas asociadas.`);
        return;
    }

    const company = user.companies[0].company;

    console.log('📦 Creando categorías base...');
    
    const categoriesData = [
        { name: 'Stock Masivo', description: 'Categoría para pruebas de carga' },
        { name: 'Electrónica', description: 'Artículos electrónicos y gadgets' },
        { name: 'Ropa', description: 'Prendas de vestir' },
        { name: 'Hogar', description: 'Muebles y artículos para el hogar' },
        { name: 'Deportes', description: 'Artículos deportivos' }
    ].map(cat => ({ ...cat, companyId: company.id }));

    // Buscamos crear múltiples categorías
    for (const cat of categoriesData) {
        const existingCat = await prisma.categoryProduct.findFirst({
            where: { name: cat.name, companyId: company.id }
        });

        if (!existingCat) {
            await prisma.categoryProduct.create({ data: cat });
            console.log(`   ✅ Categoría creada: ${cat.name}`);
        } else {
            console.log(`   ⚠️ La categoría "${cat.name}" ya existe, saltando...`);
        }
    }

    console.log('✅ Seeder de categorías completado.');
}

main()
    .catch((e) => {
        console.error('❌ Error en seeder de categorías:', e);
        process.exit(1);
    })
    .finally(async () => {
        const { prisma } = await import('../../packages/interfaces/lib/prisma');
        await prisma.$disconnect();
    });
