import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Decks table - represents a collection of flashcards (e.g., "Danish Language", "British History")
export const decks = pgTable('decks', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(), // Clerk user ID
  title: text('title').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Cards table - individual flashcards within a deck
export const cards = pgTable('cards', {
  id: uuid('id').defaultRandom().primaryKey(),
  deckId: uuid('deck_id').notNull().references(() => decks.id, { onDelete: 'cascade' }),
  front: text('front').notNull(), // Question/prompt (e.g., "Dog", "the battle of hastings")
  back: text('back').notNull(), // Answer (e.g., "Hund", "1066")
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const decksRelations = relations(decks, ({ many }) => ({
  cards: many(cards),
}));

export const cardsRelations = relations(cards, ({ one }) => ({
  deck: one(decks, {
    fields: [cards.deckId],
    references: [decks.id],
  }),
}));

