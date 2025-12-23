# Database Setup with Drizzle ORM

This project uses Drizzle ORM with Neon PostgreSQL.

## Environment Variables

Add the following to your `.env.local` file:

```
DATABASE_URL="postgresql://neondb_owner:npg_sSa0BgLCuJ2A@ep-raspy-surf-ag3tjwbq-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require"
```

## File Structure

- `db/index.ts` - Database connection instance
- `db/schema.ts` - Database schema definitions
- `db/queries.example.ts` - Example database queries
- `drizzle.config.ts` - Drizzle Kit configuration

## Available Scripts

- `npm run db:generate` - Generate migration files from schema changes
- `npm run db:migrate` - Run migrations
- `npm run db:push` - Push schema changes directly to the database (useful in development)
- `npm run db:studio` - Open Drizzle Studio (visual database browser)

## Quick Start

1. **Add environment variable** to `.env.local`:
   ```
   DATABASE_URL="your_connection_string"
   ```

2. **Define your schema** in `db/schema.ts`:
   ```typescript
   export const myTable = pgTable('my_table', {
     id: uuid('id').defaultRandom().primaryKey(),
     // ... other fields
   });
   ```

3. **Push schema to database**:
   ```bash
   npm run db:push
   ```

4. **Use the database** in your application:
   ```typescript
   import { db } from '@/db';
   import { myTable } from '@/db/schema';
   
   // Query example
   const data = await db.select().from(myTable);
   ```

## Working with Migrations

For production, use migrations instead of `db:push`:

1. Generate migration after schema changes:
   ```bash
   npm run db:generate
   ```

2. Apply migrations to database:
   ```bash
   npm run db:migrate
   ```

## Drizzle Studio

To visually browse and edit your database:

```bash
npm run db:studio
```

Then open your browser to the provided URL (usually https://local.drizzle.studio).

## Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Neon Documentation](https://neon.tech/docs)

