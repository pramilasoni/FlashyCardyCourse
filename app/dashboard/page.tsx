import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Layers, Calendar } from 'lucide-react';
import { getUserDecksWithCardCounts } from '@/db/queries/deck-queries';
import { CreateDeckDialog } from '@/components/create-deck-dialog';
import { DeleteDeckButton } from '@/components/delete-deck-button';

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }
  
  // Fetch user's decks with card counts via query helper
  const decksWithCounts = await getUserDecksWithCardCounts(userId);
  
  return (
    <div className="container mx-auto py-8 px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">My Decks</h1>
          <p className="text-muted-foreground mt-2">
            Manage your flashcard decks and start studying
          </p>
        </div>
        <CreateDeckDialog
          trigger={
            <Button size="lg">
              Create New Deck
            </Button>
          }
        />
      </div>

      {decksWithCounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-muted rounded-full p-6 mb-4">
            <Layers className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No decks yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Create your first flashcard deck to start learning!
          </p>
          <CreateDeckDialog
            trigger={
              <Button size="lg">
                Create Your First Deck
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decksWithCounts.map((deck) => (
            <div
              key={deck.id}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-all hover:shadow-lg relative group"
            >
              <div 
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                style={{ pointerEvents: 'auto' }}
              >
                <DeleteDeckButton deckId={deck.id} deckTitle={deck.title} />
              </div>
              <Link
                href={`/decks/${deck.id}`}
                className="block"
              >
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors pr-8">
                  {deck.title}
                </h3>
                {deck.description && (
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {deck.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    <span>{deck.cardCount} cards</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(deck.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

