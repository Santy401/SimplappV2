import { config } from 'dotenv';
import { resolve } from 'path';
import { pathToFileURL } from 'url';

config({ path: resolve(__dirname, '..', '.env') });

async function main() {
    const prismaPath = resolve(__dirname, '..', '..', '..', 'packages/interfaces/lib/prisma.ts');
    const { prisma } = await import(pathToFileURL(prismaPath).href);

    const targetEmail = 'santiprocastellar7@gmail.com';
    console.log(`🚀 Iniciando prueba de carga masiva para: ${targetEmail}`);

    // 0. Buscar al usuario y su empresa
    const user = await prisma.user.findUnique({
        where: { email: targetEmail },
        include: { companies: { include: { company: true } } }
    });

    if (!user || user.companies.length === 0) {
        console.error(`❌ Error: No se encontró al usuario ${targetEmail} o no tiene empresas asociadas.`);
        return;
    }

    const company = user.companies[0].company;
    console.log(`🏢 Empresa objetivo: ${company.companyName} (${company.id})`);

    // 1. Obtener o crear una categoría
    let category = await prisma.categoryProduct.findFirst({
        where: { companyId: company.id }
    });

    if (!category) {
        console.log('📦 Creando categoría base...');
        category = await prisma.categoryProduct.create({
            data: {
                name: 'Stock Masivo',
                description: 'Categoría para pruebas de carga',
                companyId: company.id
            }
        });
    }

    // 2. Crear Bodegas (50)
    console.log('🏬 Creando 50 bodegas...');
    const storesData = Array.from({ length: 50 }).map((_, i) => ({
        name: `Bodega ${i + 1} - ${company.companyName}`,
        address: `Calle Falsa ${123 + i}`,
        observation: 'Lote de prueba masiva',
        companyId: company.id
    }));
    await prisma.store.createMany({ data: storesData, skipDuplicates: true });

    // 3. Crear Vendedores (50)
    console.log('👥 Creando 50 vendedores...');
    const sellersData = Array.from({ length: 50 }).map((_, i) => ({
        name: `Vendedor ${i + 1}`,
        identification: `VEND-${1000 + i}`,
        observation: 'Vendedor automático de pruebas',
        companyId: company.id
    }));
    await prisma.seller.createMany({ data: sellersData, skipDuplicates: true });

    // 4. Crear Clientes (500)
    console.log('👤 Creando 500 clientes...');
    const clientsData = Array.from({ length: 500 }).map((_, i) => ({
        firstName: `Cliente_Bulk_${i + 1}`,
        firstLastName: `Prueba`,
        identificationNumber: `NIT-${targetEmail.split('@')[0]}-${3000 + i}`,
        identificationType: 'NIT',
        organizationType: i % 2 === 0 ? 'NATURAL_PERSON' : 'COMPANY',
        email: `bulk_cliente${i + 1}@simplapp.test`,
        phone: `300${2000000 + i}`,
        country: 'Colombia',
        address: `Dirección de Prueba ${i}`,
        companyId: company.id
    }));

    try {
        await prisma.client.createMany({ data: clientsData, skipDuplicates: true });
    } catch (e) {
        console.log('   ⚠️ Algunos clientes ya existen, saltando...');
    }

    // 5. Crear Productos (500)
    console.log('📦 Creando 500 productos...');
    const productsData = Array.from({ length: 500 }).map((_, i) => ({
        name: `Producto Bulk ${i + 1}`,
        code: `BULK-SKU-${7000 + i}`,
        reference: `REF-B-${i}`,
        type: 'PRODUCT',
        unit: 'UNIDAD',
        taxRate: '19',
        cost: 10000 + (i * 50),
        basePrice: 20000 + (i * 50),
        finalPrice: 23800 + (i * 59.5),
        companyId: company.id,
        categoryProductId: category.id
    }));

    try {
        await prisma.product.createMany({ data: productsData, skipDuplicates: true });
    } catch (e) {
        console.log('   ⚠️ Algunos productos ya existen, saltando...');
    }

    console.log('\n✅ Carga masiva completada exitosamente.');
    console.log('-------------------------------------------');
    console.log(`Resumen para ${company.companyName}:`);
    console.log(`- Clientes: 500`);
    console.log(`- Productos: 500`);
    console.log(`- Bodegas: 50`);
    console.log(`- Vendedores: 50`);
    console.log('-------------------------------------------');
}

main()
    .catch((e) => {
        console.error('❌ Error en la prueba masiva:', e);
        process.exit(1);
    })
    .finally(async () => {
        const prismaPath = resolve(__dirname, '..', '..', '..', 'packages/interfaces/lib/prisma.ts');
        const { prisma } = await import(pathToFileURL(prismaPath).href);
        await prisma.$disconnect();
    });
