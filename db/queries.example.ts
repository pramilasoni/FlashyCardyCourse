import { db } from './index';
import { decks, cards } from './schema';
import { eq, and } from 'drizzle-orm';

// Example queries - you can use these as a reference

// Create a new deck
export async function createDeck(userId: string, title: string, description?: string) {
  const [deck] = await db
    .insert(decks)
    .values({
      userId,
      title,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  return deck;
}

// Get all decks for a user
export async function getAllDecks(userId: string) {
  return await db
    .select()
    .from(decks)
    .where(eq(decks.userId, userId));
}

// Get deck by ID (with ownership verification)
export async function getDeckById(deckId: string, userId: string) {
  const [deck] = await db
    .select()
    .from(decks)
    .where(and(
      eq(decks.id, deckId),
      eq(decks.userId, userId)
    ))
    .limit(1);
  return deck;
}

// Update deck
export async function updateDeck(deckId: string, userId: string, data: { title?: string; description?: string }) {
  const [updatedDeck] = await db
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
  return updatedDeck;
}

// Delete deck
export async function deleteDeck(deckId: string, userId: string) {
  await db
    .delete(decks)
    .where(and(
      eq(decks.id, deckId),
      eq(decks.userId, userId)
    ));
}

// Create a new card
export async function createCard(deckId: string, front: string, back: string) {
  const [card] = await db
    .insert(cards)
    .values({
      deckId,
      front,
      back,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  return card;
}

// Get all cards for a deck
export async function getCardsByDeck(deckId: string) {
  return await db
    .select()
    .from(cards)
    .where(eq(cards.deckId, deckId));
}

