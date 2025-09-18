import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from "../src/lib/server/db/schema.js";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create database connection
const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema: { users } });

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // Check if test user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, "test@example.com"),
    });

    if (!existingUser) {
      // Create test user
      const hashedPassword = await bcrypt.hash("password123", 12);

      await db.insert(users).values({
        id: nanoid(),
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword,
        emailVerified: new Date(),
        role: "user",
        isActive: true,
      });

      console.log("✅ Test user created: test@example.com / password123");
    } else {
      console.log("ℹ️ Test user already exists");
    }

    console.log("🎉 Seeding completed!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
