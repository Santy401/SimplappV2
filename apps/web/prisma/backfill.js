const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function backfill() {
    console.log('Iniciando backfill de User -> Company...');

    const users = await prisma.user.findMany({
        include: {
            companies: true,
        },
    });

    console.log(`Encontrados ${users.length} usuarios.`);

    for (const user of users) {
        if (!user.companies || user.companies.length === 0) {
            console.log(`⚠️ User ${user.email} no tiene UserCompany. Creando uno...`);
            // Crea la empresa si por alguna razón no la tiene (por bugs del pasado)
            const newCompany = await prisma.company.create({
                data: {
                    companyName: user.companyName || user.name || "Mi Empresa",
                    commercialName: user.legalName || null,
                    identificationNumber: user.taxIdentification || "",
                    address: user.address || "",
                    department: user.state || null,
                    municipality: user.city || null,
                    postalCode: user.zipCode || null,
                    phone: user.phone || null,
                    email: user.billingEmail || user.email || null,
                    website: user.website || null,
                    currency: user.currency || "COP",
                    invoicePrefix: user.invoicePrefix || "FAC",
                    invoiceInitialNumber: user.invoiceInitialNumber || 1,
                    defaultTax: user.defaultTax || "19",
                    logoUrl: user.companyLogo || null,
                }
            });
            await prisma.userCompany.create({
                data: {
                    userId: user.id,
                    companyId: newCompany.id,
                    role: 'OWNER'
                }
            });
            console.log(`✅ Empresa creada para ${user.email}`);
        } else {
            // Tomamos la primera empresa del usuario para migrar los datos
            const companyId = user.companies[0].companyId;
            console.log(`🔄 Actualizando empresa ${companyId} de usuario ${user.email}...`);

            await prisma.company.update({
                where: { id: companyId },
                data: {
                    companyName: user.companyName || user.name || "Mi Empresa",
                    commercialName: user.legalName || null,
                    identificationNumber: user.taxIdentification || "",
                    address: user.address || "",
                    department: user.state || null,
                    municipality: user.city || null,
                    postalCode: user.zipCode || null,
                    phone: user.phone || null,
                    email: user.billingEmail || user.email || null,
                    website: user.website || null,
                    currency: user.currency || "COP",
                    invoicePrefix: user.invoicePrefix || "FAC",
                    invoiceInitialNumber: user.invoiceInitialNumber || 1,
                    defaultTax: user.defaultTax || "19",
                    logoUrl: user.companyLogo || null,
                }
            });
            console.log(`✅ Empresa actualizada para ${user.email}`);
        }
    }

    console.log('🎉 Backfill completado con éxito!');
    await prisma.$disconnect();
}

backfill().catch(e => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
});
