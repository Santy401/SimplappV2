import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../apps/web/.env') });

async function main() {
    const { prisma } = await import('../../packages/interfaces/lib/prisma');


    const targetEmail = 'santiprocastellar7@gmail.com';
    console.log(`🚀 Iniciando seeder de CUENTAS BANCARIAS para: ${targetEmail}`);

    const user = await prisma.user.findUnique({
        where: { email: targetEmail },
        include: { companies: { include: { company: true } } }
    });

    if (!user || user.companies.length === 0) {
        console.error(`❌ Error: No se encontró al usuario ${targetEmail}.`);
        return;
    }

    const company = user.companies[0].company;

    console.log('🏦 Creando cuentas bancarias principales...');
    
    const accountsData = [
        { name: 'Caja General', type: 'CASH', currency: 'COP', description: 'Efectivo en caja chica', balance: 0 },
        { name: 'Bancolombia Principal', type: 'BANK', currency: 'COP', description: 'Cuenta corriente Bancolombia', balance: 0 },
        { name: 'Nequi Pagos', type: 'BANK', currency: 'COP', description: 'Billetera Nequi', balance: 0 }
    ].map(acc => ({ ...acc, companyId: company.id }));

    for (const acc of accountsData) {
        const existingAcc = await prisma.bankAccount.findFirst({
            where: { name: acc.name, companyId: company.id }
        });

        if (!existingAcc) {
            await prisma.bankAccount.create({ data: acc });
            console.log(`   ✅ Cuenta creada: ${acc.name}`);
        } else {
            console.log(`   ⚠️ La cuenta "${acc.name}" ya existe, saltando...`);
        }
    }

    console.log('✅ Seeder de cuentas bancarias completado.');
}

main()
    .catch((e) => {
        console.error('❌ Error en seeder de cuentas bancarias:', e);
        process.exit(1);
    })
    .finally(async () => {
        const { prisma } = await import('../../packages/interfaces/lib/prisma');
        await prisma.$disconnect();
    });
