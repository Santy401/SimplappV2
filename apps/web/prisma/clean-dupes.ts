import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '..', '.env') });

async function main() {
    const { prisma } = await import('@interfaces/lib/prisma');
    console.log('🧹 Limpiando categorías duplicadas...');

    const defaultCompany = await prisma.company.findFirst();
    if (!defaultCompany) {
        console.log('⚠️ No company found.');
        return;
    }

    const categories = await prisma.categoryProduct.findMany({
        where: { companyId: defaultCompany.id },
        orderBy: { name: 'asc' }
    });

    const seen = new Set();
    let deletedCount = 0;

    for (const category of categories) {
        if (seen.has(category.name)) {
            await prisma.categoryProduct.delete({ where: { id: category.id } });
            console.log(`🗑️  Eliminada categoría duplicada: ${category.name} (${category.id})`);
            deletedCount++;
        } else {
            seen.add(category.name);
        }
    }

    console.log(`\n🎉 Limpieza completada exitosamente! Se eliminaron ${deletedCount} duplicados.`);
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        const { prisma } = await import('@interfaces/lib/prisma');
        await prisma.$disconnect();
    });
