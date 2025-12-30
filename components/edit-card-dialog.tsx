'use client';

import { useState } from 'react';
import { updateCard, deleteCard } from '@/app/actions/card-actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Trash2, Loader2 } from 'lucide-react';

interface Card {
  id: string;
  front: string;
  back: string;
  deckId: string;
}

interface EditCardDialogProps {
  card: Card;
}

export function EditCardDialog({ card }: EditCardDialogProps) {
  const [open, setOpen] = useState(false);
  const [front, setFront] = useState(card.front);
  const [back, setBack] = useState(card.back);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await updateCard({
        cardId: card.id,
        deckId: card.deckId,
        front,
        back,
      });

      if (result.success) {
        setOpen(false);
      } else {
        setError(result.error || 'Failed to update card');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this card? This action cannot be undone.')) {
      return;
    }

    setError(null);
    setIsDeleting(true);

    try {
      const result = await deleteCard({
        cardId: card.id,
        deckId: card.deckId,
      });

      if (result.success) {
        setOpen(false);
      } else {
        setError(result.error || 'Failed to delete card');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit card</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Card</DialogTitle>
            <DialogDescription>
              Update the front and back content of this flashcard.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="front">Front</Label>
              <Textarea
                id="front"
                value={front}
                onChange={(e) => setFront(e.target.value)}
                placeholder="Question or prompt"
                required
                maxLength={1000}
                rows={3}
                disabled={isSubmitting || isDeleting}
              />
              <p className="text-xs text-muted-foreground">
                {front.length}/1000 characters
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="back">Back</Label>
              <Textarea
                id="back"
                value={back}
                onChange={(e) => setBack(e.target.value)}
                placeholder="Answer or explanation"
                required
                maxLength={1000}
                rows={3}
                disabled={isSubmitting || isDeleting}
              />
              <p className="text-xs text-muted-foreground">
                {back.length}/1000 characters
              </p>
            </div>
            
            {error && (
              <div className="text-sm text-destructive">
                {error}
              </div>
            )}
          </div>
          
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting || isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isDeleting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

