import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq, sql } from 'drizzle-orm'; // Import 'sql' for raw queries


const db = drizzle(process.env.DATABASE_URL!);

export async function test_database() {
    try {
        console.log(process.env.DATABASE_URL!);
        console.log("⏳ Pinging database to verify connection...");
        // This runs a raw SQL query just to see if the DB responds
        await db.execute(sql`SELECT 1`);
        console.log("✅ Database connection established!");
    } catch (error) {
        console.error("❌ Failed to connect to database:", error);
        // Stop the function here if connection fails
        return;
    }
}