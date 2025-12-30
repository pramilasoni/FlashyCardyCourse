import { db } from '@/db';
import { decks, cards } from '@/db/schema';
import { eq, desc, count } from 'drizzle-orm';

/**
 * Get all decks for a specific user, ordered by most recently updated
 */
export async function getUserDecks(userId: string) {
  return await db
    .select()
    .from(decks)
    .where(eq(decks.userId, userId))
    .orderBy(desc(decks.updatedAt));
}

/**
 * Get a specific deck by ID for a user (with ownership verification)
 */
export async function getDeckById(deckId: string, userId: string) {
  const result = await db
    .select()
    .from(decks)
    .where(eq(decks.id, deckId))
    .limit(1);
  
  // Verify ownership
  if (result[0] && result[0].userId !== userId) {
    return null;
  }
  
  return result[0] || null;
}

/**
 * Get all decks for a user with card counts
 */
export async function getUserDecksWithCardCounts(userId: string) {
  const userDecks = await getUserDecks(userId);
  
  // Get card counts for each deck
  const decksWithCounts = await Promise.all(
    userDecks.map(async (deck) => {
      const deckCards = await db
        .select()
        .from(cards)
        .where(eq(cards.deckId, deck.id));
      
      return {
        ...deck,
        cardCount: deckCards.length,
      };
    })
  );
  
  return decksWithCounts;
}

/**
 * Get cards for a specific deck
 */
export async function getCardsByDeckId(deckId: string) {
  return await db
    .select()
    .from(cards)
    .where(eq(cards.deckId, deckId));
}

/**
 * Get deck with all its cards (with ownership verification)
 */
export async function getDeckWithCards(deckId: string, userId: string) {
  // First verify ownership
  const deck = await getDeckById(deckId, userId);
  if (!deck) return null;
  
  // Get cards for this deck
  const deckCards = await getCardsByDeckId(deckId);
  
  return {
    ...deck,
    cards: deckCards,
  };
}

/**
 * Get deck progress statistics (with ownership verification)
 */
export async function getDeckProgress(deckId: string, userId: string) {
  // First verify ownership
  const deck = await getDeckById(deckId, userId);
  if (!deck) return null;
  
  // Get all cards for this deck
  const deckCards = await getCardsByDeckId(deckId);
  
  if (deckCards.length === 0) {
    return {
      totalCards: 0,
      studiedCards: 0,
      masteredCards: 0,
      progressPercentage: 0,
      averageMastery: 0,
    };
  }
  
  // Calculate progress statistics
  const studiedCards = deckCards.filter(card => (card.masteryLevel ?? 0) > 0).length;
  const masteredCards = deckCards.filter(card => (card.masteryLevel ?? 0) >= 5).length;
  const totalMastery = deckCards.reduce((sum, card) => sum + (card.masteryLevel ?? 0), 0);
  const averageMastery = totalMastery / deckCards.length;
  
  // Progress percentage based on average mastery (0-5 scale = 0-100%)
  const progressPercentage = Math.round((averageMastery / 5) * 100);
  
  return {
    totalCards: deckCards.length,
    studiedCards,
    masteredCards,
    progressPercentage,
    averageMastery: Math.round(averageMastery * 10) / 10, // Round to 1 decimal
  };
}

