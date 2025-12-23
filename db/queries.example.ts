import { db } from './index';
import { users } from './schema';
import { eq } from 'drizzle-orm';

// Example queries - you can use these as a reference

// Create a new user
export async function createUser(email: string, name?: string) {
  const [user] = await db
    .insert(users)
    .values({
      email,
      name,
    })
    .returning();
  return user;
}

// Get all users
export async function getAllUsers() {
  return await db.select().from(users);
}

// Get user by email
export async function getUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));
  return user;
}

// Update user
export async function updateUser(id: string, data: { email?: string; name?: string }) {
  const [updatedUser] = await db
    .update(users)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();
  return updatedUser;
}

// Delete user
export async function deleteUser(id: string) {
  await db.delete(users).where(eq(users.id, id));
}

