import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../apps/web/.env') });

async function main() {
    const { prisma } = await import('../../packages/interfaces/lib/prisma');

    const targetEmail = 'santiprocastellar7@gmail.com';
    console.log(`🚀 Iniciando seeder de BODEGAS para: ${targetEmail}`);

    const user = await prisma.user.findUnique({
        where: { email: targetEmail },
        include: { companies: { include: { company: true } } }
    });

    if (!user || user.companies.length === 0) {
        console.error(`❌ Error: No se encontró al usuario ${targetEmail}.`);
        return;
    }

    const company = user.companies[0].company;

    console.log('🏬 Creando 50 bodegas...');
    const storesData = Array.from({ length: 50 }).map((_, i) => ({
        name: `Bodega ${i + 1} - ${company.companyName}`,
        address: `Calle Falsa ${123 + i}`,
        observation: 'Lote de prueba masiva de bodegas',
        companyId: company.id
    }));

    await prisma.store.createMany({ data: storesData, skipDuplicates: true });

    console.log('✅ Seeder de bodegas completado.');
}

main()
    .catch((e) => {
        console.error('❌ Error en seeder de bodegas:', e);
        process.exit(1);
    })
    .finally(async () => {
        const { prisma } = await import('../../packages/interfaces/lib/prisma');
        await prisma.$disconnect();
    });
