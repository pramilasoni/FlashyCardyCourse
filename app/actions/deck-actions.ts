'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { insertDeck, updateDeckById, deleteDeckById } from '@/db/queries/deck-mutations';

// CREATE DECK
const createDeckSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
});

type CreateDeckInput = z.infer<typeof createDeckSchema>;

export async function createDeck(input: CreateDeckInput) {
  const result = createDeckSchema.safeParse(input);
  
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
  
  const newDeck = await insertDeck({
    title: result.data.title,
    description: result.data.description,
    userId,
  });
  
  revalidatePath('/dashboard');
  
  return { success: true, deck: newDeck };
}

// UPDATE DECK
const updateDeckSchema = z.object({
  id: z.string().uuid('Invalid deck ID'),
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
});

type UpdateDeckInput = z.infer<typeof updateDeckSchema>;

export async function updateDeck(input: UpdateDeckInput) {
  const result = updateDeckSchema.safeParse(input);
  
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
  
  const updated = await updateDeckById(
    result.data.id,
    userId,
    {
      title: result.data.title,
      description: result.data.description,
    }
  );
  
  if (!updated) {
    return { success: false, error: 'Deck not found or access denied' };
  }
  
  revalidatePath(`/decks/${result.data.id}`);
  revalidatePath('/dashboard');
  
  return { success: true, deck: updated };
}

// DELETE DECK
const deleteDeckSchema = z.object({
  id: z.string().uuid('Invalid deck ID'),
});

type DeleteDeckInput = z.infer<typeof deleteDeckSchema>;

export async function deleteDeck(input: DeleteDeckInput) {
  const result = deleteDeckSchema.safeParse(input);
  
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
  
  const deleted = await deleteDeckById(result.data.id, userId);
  
  if (!deleted) {
    return { success: false, error: 'Deck not found or access denied' };
  }
  
  revalidatePath('/dashboard');
  
  return { success: true };
}

