import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../apps/web/.env') });

async function main() {
    const { prisma } = await import('../../packages/interfaces/lib/prisma');

    const targetEmail = 'santiprocastellar7@gmail.com';
    console.log(`🚀 Iniciando seeder de VENDEDORES para: ${targetEmail}`);

    const user = await prisma.user.findUnique({
        where: { email: targetEmail },
        include: { companies: { include: { company: true } } }
    });

    if (!user || user.companies.length === 0) {
        console.error(`❌ Error: No se encontró al usuario ${targetEmail}.`);
        return;
    }

    const company = user.companies[0].company;

    console.log('👥 Creando 50 vendedores...');
    const sellersData = Array.from({ length: 50 }).map((_, i) => ({
        name: `Vendedor ${i + 1}`,
        identification: `VEND-${1000 + i}`,
        observation: 'Vendedor automático del seeder',
        companyId: company.id
    }));

    await prisma.seller.createMany({ data: sellersData, skipDuplicates: true });

    console.log('✅ Seeder de vendedores completado.');
}

main()
    .catch((e) => {
        console.error('❌ Error en seeder de vendedores:', e);
        process.exit(1);
    })
    .finally(async () => {
        const { prisma } = await import('../../packages/interfaces/lib/prisma');
        await prisma.$disconnect();
    });
