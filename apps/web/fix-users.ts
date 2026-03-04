// @ts-ignore
import { Client } from 'pg';
import 'dotenv/config';

async function main() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    await client.query(`UPDATE "User" SET "lastCompanyId" = '' WHERE "lastCompanyId" IS NULL;`);

    const { rows } = await client.query(`SELECT id FROM "Company" LIMIT 1;`);
    const firstCompanyId = rows[0]?.id || '';

    // Also check other tables just in case
    if (firstCompanyId) {
        await client.query(`UPDATE "Client" SET "companyId" = $1 WHERE "companyId" IS NULL;`, [firstCompanyId]);
        await client.query(`UPDATE "Store" SET "companyId" = $1 WHERE "companyId" IS NULL;`, [firstCompanyId]);
        await client.query(`UPDATE "Seller" SET "companyId" = $1 WHERE "companyId" IS NULL;`, [firstCompanyId]);
    }

    console.log('Fixed missing company IDs in User, Client, Store, Seller');
    await client.end();
}

main().catch(console.error);
