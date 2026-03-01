import { config } from 'dotenv';
import { resolve } from 'path';
import { pathToFileURL } from 'url';

config({ path: resolve(__dirname, '..', '.env') });

async function main() {
    const prismaPath = resolve(__dirname, '..', '..', '..', 'packages/interfaces/lib/prisma.ts');
    const { prisma } = await import(pathToFileURL(prismaPath).href);

    const targetEmail = 'santiprocastellar7@gmail.com';
    console.log(`🚀 Generando facturas masivas para: ${targetEmail}`);

    // 0. Buscar al usuario y su empresa
    const user = await prisma.user.findUnique({
        where: { email: targetEmail },
        include: { companies: { include: { company: true } } }
    });

    if (!user || user.companies.length === 0) {
        console.error(`❌ Error: No se encontró al usuario ${targetEmail}.`);
        return;
    }

    const company = user.companies[0].company;
    console.log(`🏢 Empresa: ${company.companyName}`);

    // 1. Obtener datos necesarios
    const clients = await prisma.client.findMany({ where: { companyId: company.id }, take: 50 });
    const products = await prisma.product.findMany({ where: { companyId: company.id }, take: 50 });
    const stores = await prisma.store.findMany({ where: { companyId: company.id }, take: 5 });
    const sellers = await prisma.seller.findMany({ where: { companyId: company.id }, take: 5 });

    if (clients.length === 0 || products.length === 0) {
        console.error('❌ Error: Necesitas clientes y productos primero.');
        return;
    }

    // 2. Obtener el último número de factura
    const lastBill = await prisma.bill.findFirst({
        where: { companyId: company.id },
        orderBy: { number: 'desc' }
    });
    let nextNumber = (lastBill?.number || 0) + 1;

    console.log(`📝 Creando 100 facturas a partir del número ${nextNumber}...`);

    for (let i = 0; i < 100; i++) {
        const client = clients[Math.floor(Math.random() * clients.length)];
        const store = stores[Math.floor(Math.random() * stores.length)];
        const seller = sellers[Math.floor(Math.random() * sellers.length)];

        // Fecha aleatoria en los últimos 90 días
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 90));

        const dueDate = new Date(date);
        dueDate.setDate(dueDate.getDate() + 30);

        // Crear la factura
        const bill = await prisma.bill.create({
            data: {
                userId: user.id,
                companyId: company.id,
                clientId: client.id,
                storeId: store.id,
                sellerId: seller?.id || null,
                number: nextNumber++,
                prefix: company.invoicePrefix || 'FAC',
                date: date,
                dueDate: dueDate,
                status: i % 5 === 0 ? 'PAID' : 'ISSUED',
                paymentMethod: 'CASH',
                subtotal: 0,
                taxTotal: 0,
                total: 0,
                balance: 0,
                clientName: `${client.firstName} ${client.firstLastName}`,
                clientIdentification: client.identificationNumber,
            }
        });

        // Añadir entre 1 y 4 productos a la factura
        const numItems = Math.floor(Math.random() * 4) + 1;
        let billSubtotal = 0;
        let billTax = 0;

        for (let j = 0; j < numItems; j++) {
            const product = products[Math.floor(Math.random() * products.length)];
            const qty = Math.floor(Math.random() * 10) + 1;
            const price = Number(product.basePrice) || 10000;
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

        // Actualizar totales de la factura
        await prisma.bill.update({
            where: { id: bill.id },
            data: {
                subtotal: billSubtotal,
                taxTotal: billTax,
                total: billTotal,
                balance: bill.status === 'PAID' ? 0 : billTotal
            }
        });

        if ((i + 1) % 10 === 0) console.log(`   ✅ ${i + 1} facturas creadas...`);
    }

    console.log('\n✨ ¡Proceso completado! 100 facturas generadas con éxito.');
}

main()
    .catch((e) => {
        console.error('❌ Error generando facturas:', e);
        process.exit(1);
    })
    .finally(async () => {
        const prismaPath = resolve(__dirname, '..', '..', '..', 'packages/interfaces/lib/prisma.ts');
        const { prisma } = await import(pathToFileURL(prismaPath).href);
        await prisma.$disconnect();
    });
