---
description: Sync, reset database and generate migrations
---

1. Navigate to Web App
   - Go to `apps/web`.

2. Reset and Migrate Database
   // turbo
   - Run `npx prisma migrate dev` to apply pending changes or reset if requested.
   
3. Generate Client
   // turbo
   - Run `npx prisma generate` to update the Prisma Client.

4. Seed Database (Optional)
   // turbo
   - Run `pnpm db:seed` if fresh data is needed.
