import { prisma } from '@interfaces/lib/prisma';

async function main() {
    const result = await prisma.user.updateMany({
        data: { emailVerified: true },
    });
    console.log(`✅ ¡Se han verificado ${result.count} usuarios existentes!`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
