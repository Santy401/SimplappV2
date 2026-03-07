import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../apps/web/.env') });

async function main() {
    const { prisma } = await import('../../packages/interfaces/lib/prisma');


    const targetEmail = 'santiprocastellar7@gmail.com';
    console.log(`🚀 Iniciando seeder de FACTURAS para: ${targetEmail}`);

    const user = await prisma.user.findUnique({
        where: { email: targetEmail },
        include: { companies: { include: { company: true } } }
    });

    if (!user || user.companies.length === 0) {
        console.error(`❌ Error: No se encontró al usuario ${targetEmail}.`);
        return;
    }

    const company = user.companies[0].company;

    const clients = await prisma.client.findMany({ where: { companyId: company.id }, take: 20 });
    const products = await prisma.product.findMany({ where: { companyId: company.id }, take: 20 });
    const stores = await prisma.store.findMany({ where: { companyId: company.id }, take: 5 });
    const sellers = await prisma.seller.findMany({ where: { companyId: company.id }, take: 5 });

    if (!clients.length || !products.length || !stores.length) {
        console.error('❌ Error: Falta información base (Clientes, Productos o Bodegas). Ejecuta los otros seeders primero.');
        return;
    }

    const lastBill = await prisma.bill.findFirst({
        where: { companyId: company.id },
        orderBy: { number: 'desc' }
    });
    let nextNumber = (lastBill?.number || 0) + 1;

    console.log(`📝 Creando 20 facturas a partir del número ${nextNumber}...`);

    for (let i = 0; i < 20; i++) {
        const client = clients[Math.floor(Math.random() * clients.length)];
        const store = stores[Math.floor(Math.random() * stores.length)];
        const seller = sellers.length ? sellers[Math.floor(Math.random() * sellers.length)] : null;

        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));

        const dueDate = new Date(date);
        dueDate.setDate(dueDate.getDate() + 15);

        const bill = await prisma.bill.create({
            data: {
                userId: user.id,
                companyId: company.id,
                clientId: client.id,
                storeId: store.id,
                sellerId: seller?.id,
                number: nextNumber++,
                prefix: company.invoicePrefix || 'FAC',
                date: date,
                dueDate: dueDate,
                status: i % 3 === 0 ? 'PAID' : 'ISSUED',
                paymentMethod: 'CASH',
                subtotal: 0,
                taxTotal: 0,
                total: 0,
                balance: 0,
                clientName: `${client.firstName} ${client.firstLastName}`,
                clientIdentification: client.identificationNumber,
            }
        });

        const numItems = Math.floor(Math.random() * 3) + 1;
        let billSubtotal = 0;
        let billTax = 0;

        for (let j = 0; j < numItems; j++) {
            const product = products[Math.floor(Math.random() * products.length)];
            const qty = Math.floor(Math.random() * 5) + 1;
            const price = Number(product.basePrice) || 5000;
            const taxRate = Number(product.taxRate) || 19;

            const itemSubtotal = price * qty;
            const itemTax = itemSubtotal * (taxRate / 100);
            const itemTotal = itemSubtotal + itemTax;

            await prisma.billItem.create({
                data: {
                    billId: bill.id,
                    productId: product.id,
                    quantity: qty,
                    price: price,
                    subtotal: itemSubtotal,
                    taxRate: taxRate,
                    taxAmount: itemTax,
                    total: itemTotal,
                    productName: product.name,
                    productCode: product.code
                }
            });

            billSubtotal += itemSubtotal;
            billTax += itemTax;
        }

        const billTotal = billSubtotal + billTax;

        await prisma.bill.update({
            where: { id: bill.id },
            data: {
                subtotal: billSubtotal,
                taxTotal: billTax,
                total: billTotal,
                balance: bill.status === 'PAID' ? 0 : billTotal
            }
        });
    }

    console.log('✅ Seeder de facturas completado.');
}

main()
    .catch((e) => {
        console.error('❌ Error en seeder de facturas:', e);
        process.exit(1);
    })
    .finally(async () => {
        const { prisma } = await import('../../packages/interfaces/lib/prisma');
        await prisma.$disconnect();
    });
