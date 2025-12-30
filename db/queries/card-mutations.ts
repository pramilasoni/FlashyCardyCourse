import { db } from '@/db';
import { cards, decks } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Insert a new card for a deck (with ownership verification)
 */
export async function insertCard(data: {
  deckId: string;
  front: string;
  back: string;
  userId: string;
}) {
  // First verify deck ownership
  const [deck] = await db
    .select()
    .from(decks)
    .where(and(
      eq(decks.id, data.deckId),
      eq(decks.userId, data.userId)
    ))
    .limit(1);
  
  if (!deck) {
    return null; // User doesn't own this deck
  }
  
  const [newCard] = await db
    .insert(cards)
    .values({
      deckId: data.deckId,
      front: data.front,
      back: data.back,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  
  // Update deck's updatedAt timestamp
  await db
    .update(decks)
    .set({ updatedAt: new Date() })
    .where(eq(decks.id, data.deckId));
  
  return newCard;
}

/**
 * Update a card (with ownership verification via deck)
 */
export async function updateCardById(
  cardId: string,
  userId: string,
  data: {
    front?: string;
    back?: string;
  }
) {
  // First get the card to find its deck
  const [card] = await db
    .select()
    .from(cards)
    .where(eq(cards.id, cardId))
    .limit(1);
  
  if (!card) {
    return null; // Card not found
  }
  
  // Verify deck ownership
  const [deck] = await db
    .select()
    .from(decks)
    .where(and(
      eq(decks.id, card.deckId),
      eq(decks.userId, userId)
    ))
    .limit(1);
  
  if (!deck) {
    return null; // User doesn't own the deck this card belongs to
  }
  
  // Update the card
  const [updated] = await db
    .update(cards)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(cards.id, cardId))
    .returning();
  
  // Update deck's updatedAt timestamp
  await db
    .update(decks)
    .set({ updatedAt: new Date() })
    .where(eq(decks.id, card.deckId));
  
  return updated;
}

/**
 * Delete a card (with ownership verification via deck)
 */
export async function deleteCardById(cardId: string, userId: string) {
  // First get the card to find its deck
  const [card] = await db
    .select()
    .from(cards)
    .where(eq(cards.id, cardId))
    .limit(1);
  
  if (!card) {
    return false; // Card not found
  }
  
  // Verify deck ownership
  const [deck] = await db
    .select()
    .from(decks)
    .where(and(
      eq(decks.id, card.deckId),
      eq(decks.userId, userId)
    ))
    .limit(1);
  
  if (!deck) {
    return false; // User doesn't own the deck this card belongs to
  }
  
  // Delete the card
  await db
    .delete(cards)
    .where(eq(cards.id, cardId));
  
  // Update deck's updatedAt timestamp
  await db
    .update(decks)
    .set({ updatedAt: new Date() })
    .where(eq(decks.id, card.deckId));
  
  return true;
}

/**
 * Update card mastery level and last studied time (with ownership verification via deck)
 */
export async function updateCardMastery(
  cardId: string,
  userId: string,
  masteryLevel: number
) {
  // First get the card to find its deck
  const [card] = await db
    .select()
    .from(cards)
    .where(eq(cards.id, cardId))
    .limit(1);
  
  if (!card) {
    return null; // Card not found
  }
  
  // Verify deck ownership
  const [deck] = await db
    .select()
    .from(decks)
    .where(and(
      eq(decks.id, card.deckId),
      eq(decks.userId, userId)
    ))
    .limit(1);
  
  if (!deck) {
    return null; // User doesn't own the deck this card belongs to
  }
  
  // Clamp mastery level between 0 and 5
  const clampedMastery = Math.max(0, Math.min(5, masteryLevel));
  
  // Update the card with new mastery level and last studied time
  const [updated] = await db
    .update(cards)
    .set({
      masteryLevel: clampedMastery,
      lastStudied: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(cards.id, cardId))
    .returning();
  
  // Update deck's updatedAt timestamp
  await db
    .update(decks)
    .set({ updatedAt: new Date() })
    .where(eq(decks.id, card.deckId));
  
  return updated;
}

