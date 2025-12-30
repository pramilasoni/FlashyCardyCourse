'use client';

import { useState } from 'react';
import { createDeck } from '@/app/actions/deck-actions';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Loader2 } from 'lucide-react';

interface CreateDeckDialogProps {
  trigger?: React.ReactNode;
}

export function CreateDeckDialog({ trigger }: CreateDeckDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const result = await createDeck({
        title: title.trim(),
        description: description.trim() || undefined,
      });

      if (result.success) {
        // Reset form and close dialog
        setTitle('');
        setDescription('');
        setOpen(false);
      } else {
        if (result.errors) {
          setFieldErrors(result.errors);
        } else {
          setError(result.error || 'Failed to create deck');
        }
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
      setTitle('');
      setDescription('');
      setError(null);
      setFieldErrors({});
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Deck
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Deck</DialogTitle>
            <DialogDescription>
              Create a new flashcard deck by entering a title and optional description.
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
                aria-invalid={fieldErrors.title ? 'true' : 'false'}
              />
              {fieldErrors.title && (
                <p className="text-xs text-destructive">
                  {fieldErrors.title[0]}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {title.length}/100 characters
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description for your deck"
                maxLength={500}
                rows={3}
                disabled={isSubmitting}
                aria-invalid={fieldErrors.description ? 'true' : 'false'}
              />
              {fieldErrors.description && (
                <p className="text-xs text-destructive">
                  {fieldErrors.description[0]}
                </p>
              )}
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
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Deck
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

