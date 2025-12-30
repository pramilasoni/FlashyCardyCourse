'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { insertCard, updateCardById, deleteCardById, updateCardMastery } from '@/db/queries/card-mutations';

// CREATE CARD
const createCardSchema = z.object({
  deckId: z.string().uuid('Invalid deck ID'),
  front: z.string().min(1, 'Front content is required').max(1000, 'Front content is too long'),
  back: z.string().min(1, 'Back content is required').max(1000, 'Back content is too long'),
});

type CreateCardInput = z.infer<typeof createCardSchema>;

export async function createCard(input: CreateCardInput) {
  const result = createCardSchema.safeParse(input);
  
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }
  
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }
  
  const card = await insertCard({
    ...result.data,
    userId,
  });
  
  if (!card) {
    return { success: false, error: 'Deck not found or access denied' };
  }
  
  revalidatePath(`/decks/${result.data.deckId}`);
  revalidatePath('/dashboard');
  
  return { success: true, card };
}

// UPDATE CARD
const updateCardSchema = z.object({
  cardId: z.string().uuid('Invalid card ID'),
  deckId: z.string().uuid('Invalid deck ID'),
  front: z.string().min(1, 'Front content is required').max(1000, 'Front content is too long'),
  back: z.string().min(1, 'Back content is required').max(1000, 'Back content is too long'),
});

type UpdateCardInput = z.infer<typeof updateCardSchema>;

export async function updateCard(input: UpdateCardInput) {
  const result = updateCardSchema.safeParse(input);
  
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }
  
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }
  
  const updated = await updateCardById(
    result.data.cardId,
    userId,
    {
      front: result.data.front,
      back: result.data.back,
    }
  );
  
  if (!updated) {
    return { success: false, error: 'Card not found or access denied' };
  }
  
  revalidatePath(`/decks/${result.data.deckId}`);
  revalidatePath('/dashboard');
  
  return { success: true, card: updated };
}

// DELETE CARD
const deleteCardSchema = z.object({
  cardId: z.string().uuid('Invalid card ID'),
  deckId: z.string().uuid('Invalid deck ID'),
});

type DeleteCardInput = z.infer<typeof deleteCardSchema>;

export async function deleteCard(input: DeleteCardInput) {
  const result = deleteCardSchema.safeParse(input);
  
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }
  
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }
  
  const deleted = await deleteCardById(result.data.cardId, userId);
  
  if (!deleted) {
    return { success: false, error: 'Card not found or access denied' };
  }
  
  revalidatePath(`/decks/${result.data.deckId}`);
  revalidatePath('/dashboard');
  
  return { success: true };
}

// STUDY CARD (UPDATE MASTERY)
const studyCardSchema = z.object({
  cardId: z.string().uuid('Invalid card ID'),
  masteryLevel: z.number().int().min(0).max(5),
});

type StudyCardInput = z.infer<typeof studyCardSchema>;

export async function studyCard(input: StudyCardInput) {
  const result = studyCardSchema.safeParse(input);
  
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }
  
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }
  
  const updated = await updateCardMastery(
    result.data.cardId,
    userId,
    result.data.masteryLevel
  );
  
  if (!updated) {
    return { success: false, error: 'Card not found or access denied' };
  }
  
  // Revalidate the deck page and study page
  const deckId = updated.deckId;
  
  revalidatePath(`/decks/${deckId}`);
  revalidatePath(`/decks/${deckId}/study`);
  revalidatePath('/dashboard');
  
  return { success: true, card: updated };
}

