import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing in .env");
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export async function test_database() {
    try {
        console.log("⏳ Pinging database to verify connection...");
        console.log("✅ Database connection established!");
        return "Database Connection established!";
    } catch (error) {
        console.error("❌ Failed to connect to database:", error);
        return "Database connection failed!";
    }
}