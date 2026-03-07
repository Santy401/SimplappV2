import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../apps/web/.env') });

async function main() {
    const { prisma } = await import('../../packages/interfaces/lib/prisma');

    const targetEmail = 'santiprocastellar7@gmail.com';
    console.log(`🚀 Iniciando seeder de CLIENTES para: ${targetEmail}`);

    const user = await prisma.user.findUnique({
        where: { email: targetEmail },
        include: { companies: { include: { company: true } } }
    });

    if (!user || user.companies.length === 0) {
        console.error(`❌ Error: No se encontró al usuario ${targetEmail}.`);
        return;
    }

    const company = user.companies[0].company;

    console.log('👤 Creando 50 clientes de prueba...');
    const clientsData = Array.from({ length: 50 }).map((_, i) => ({
        firstName: `Cliente_Base_${i + 1}`,
        firstLastName: `Automático`,
        identificationNumber: `NIT-BASE-${3000 + i}`,
        identificationType: 'NIT',
        organizationType: i % 2 === 0 ? 'NATURAL_PERSON' : 'COMPANY',
        email: `base_cliente${i + 1}@simplapp.test`,
        phone: `300${2000000 + i}`,
        country: 'Colombia',
        address: `Dirección generada #${i}`,
        companyId: company.id
    }));

    try {
        await prisma.client.createMany({ data: clientsData, skipDuplicates: true });
    } catch (e) {
        console.log('   ⚠️ Algunos clientes ya existen, continuando...');
    }

    console.log('✅ Seeder de clientes completado.');
}

main()
    .catch((e) => {
        console.error('❌ Error en seeder de clientes:', e);
        process.exit(1);
    })
    .finally(async () => {
        const { prisma } = await import('../../packages/interfaces/lib/prisma');
        await prisma.$disconnect();
    });
