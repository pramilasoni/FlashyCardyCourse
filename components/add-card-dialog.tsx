'use client';

import { useState } from 'react';
import { createCard } from '@/app/actions/card-actions';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Loader2 } from 'lucide-react';

interface AddCardDialogProps {
  deckId: string;
  trigger?: React.ReactNode;
}

export function AddCardDialog({ deckId, trigger }: AddCardDialogProps) {
  const [open, setOpen] = useState(false);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await createCard({
        deckId,
        front,
        back,
      });

      if (result.success) {
        // Reset form and close dialog
        setFront('');
        setBack('');
        setOpen(false);
      } else {
        setError(result.error || 'Failed to create card');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleOpenChange(newOpen: boolean) {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form when dialog closes
      setFront('');
      setBack('');
      setError(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Card
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Card</DialogTitle>
            <DialogDescription>
              Create a new flashcard by entering the front and back content.
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
                disabled={isSubmitting}
                autoFocus
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
                disabled={isSubmitting}
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
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !front.trim() || !back.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Card
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

