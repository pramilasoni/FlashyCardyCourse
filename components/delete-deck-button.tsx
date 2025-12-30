'use client';

import { useState } from 'react';
import { deleteDeck } from '@/app/actions/deck-actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';

interface DeleteDeckButtonProps {
  deckId: string;
  deckTitle: string;
}

export function DeleteDeckButton({ deckId, deckTitle }: DeleteDeckButtonProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setError(null);
    setIsDeleting(true);

    try {
      const result = await deleteDeck({ id: deckId });

      if (result.success) {
        setOpen(false);
      } else {
        setError(result.error || 'Failed to delete deck');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete deck</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Deck</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this deck? This action cannot be undone.
            All cards in this deck will also be permanently deleted.
            <div className="mt-2 p-2 bg-muted rounded text-sm">
              <div className="font-medium mb-1">Deck:</div>
              <div className="text-muted-foreground">{deckTitle}</div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <div className="text-sm text-destructive">{error}</div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

