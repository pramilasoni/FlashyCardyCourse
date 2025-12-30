import { db } from '@/db';
import { decks, cards } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Insert a new deck for a user
 */
export async function insertDeck(data: {
  title: string;
  description?: string;
  userId: string;
}) {
  const [newDeck] = await db
    .insert(decks)
    .values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  
  return newDeck;
}

/**
 * Update a deck (with ownership verification)
 */
export async function updateDeckById(
  deckId: string,
  userId: string,
  data: {
    title?: string;
    description?: string;
  }
) {
  const [updated] = await db
    .update(decks)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(
      eq(decks.id, deckId),
      eq(decks.userId, userId)
    ))
    .returning();
  
  return updated || null;
}

/**
 * Delete a deck and all its cards (with ownership verification)
 * Uses a transaction to ensure atomicity
 */
export async function deleteDeckById(deckId: string, userId: string) {
  return await db.transaction(async (tx) => {
    // First verify ownership
    const [deck] = await tx
      .select()
      .from(decks)
      .where(and(
        eq(decks.id, deckId),
        eq(decks.userId, userId)
      ))
      .limit(1);
    
    if (!deck) {
      return false; // Deck not found or user doesn't own it
    }
    
    // Delete all cards associated with this deck
    await tx
      .delete(cards)
      .where(eq(cards.deckId, deckId));
    
    // Delete the deck
    const result = await tx
      .delete(decks)
      .where(eq(decks.id, deckId))
      .returning();
    
    return result.length > 0;
  });
}

