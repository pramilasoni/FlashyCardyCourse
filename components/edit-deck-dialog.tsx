'use client';

import { useState } from 'react';
import { updateDeck } from '@/app/actions/deck-actions';
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
import { Pencil, Loader2 } from 'lucide-react';

interface Deck {
  id: string;
  title: string;
  description?: string | null;
}

interface EditDeckDialogProps {
  deck: Deck;
  trigger?: React.ReactNode;
}

export function EditDeckDialog({ deck, trigger }: EditDeckDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(deck.title);
  const [description, setDescription] = useState(deck.description || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await updateDeck({
        id: deck.id,
        title,
        description: description || undefined,
      });

      if (result.success) {
        setOpen(false);
      } else {
        setError(result.error || 'Failed to update deck');
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
      setTitle(deck.title);
      setDescription(deck.description || '');
      setError(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Pencil className="h-4 w-4 mr-2" />
            Edit Deck
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Deck</DialogTitle>
            <DialogDescription>
              Update the title and description of this deck.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Deck title"
                required
                maxLength={100}
                disabled={isSubmitting}
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                {title.length}/100 characters
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deck description"
                maxLength={500}
                rows={3}
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                {description.length}/500 characters
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
              disabled={isSubmitting || !title.trim()}
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

