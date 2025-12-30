import { auth } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import { getDeckWithCards, getDeckProgress } from '@/db/queries/deck-queries';
import { Button } from '@/components/ui/button';
import { EditCardDialog } from '@/components/edit-card-dialog';
import { AddCardDialog } from '@/components/add-card-dialog';
import { EditDeckDialog } from '@/components/edit-deck-dialog';
import { StudyProgressBar } from '@/components/study-progress-bar';
import { DeleteCardButton } from '@/components/delete-card-button';
import Link from 'next/link';
import { ArrowLeft, Layers } from 'lucide-react';

interface DeckPageProps {
  params: Promise<{
    deckId: string;
  }>;
}

export default async function DeckPage({ params }: DeckPageProps) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }
  
  const { deckId } = await params;
  
  // Fetch deck with cards via query helper (includes ownership verification)
  const deckWithCards = await getDeckWithCards(deckId, userId);
  
  // If deck doesn't exist or user doesn't own it
  if (!deckWithCards) {
    notFound();
  }
  
  const { cards, ...deck } = deckWithCards;
  
  // Get deck progress statistics
  const progress = await getDeckProgress(deckId, userId);
  
  return (
    <div className="container mx-auto py-8 px-6">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{deck.title}</h1>
            {deck.description && (
              <p className="text-muted-foreground text-lg">{deck.description}</p>
            )}
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                <span>{cards.length} cards</span>
              </div>
              <div>
                Updated {new Date(deck.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <EditDeckDialog deck={deck} />
            <Button asChild>
              <Link href={`/decks/${deckId}/study`}>
                Start Studying
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Progress Bar */}
        {progress && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
            <StudyProgressBar
              totalCards={progress.totalCards}
              studiedCards={progress.studiedCards}
              masteredCards={progress.masteredCards}
              progressPercentage={progress.progressPercentage}
              averageMastery={progress.averageMastery}
            />
          </div>
        )}
      </div>
      
      {/* Cards Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Cards</h2>
          <AddCardDialog deckId={deckId} />
        </div>
        
        {cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-lg">
            <div className="bg-muted rounded-full p-6 mb-4">
              <Layers className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No cards yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Add your first flashcard to start building this deck!
            </p>
            <AddCardDialog deckId={deckId} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors relative group"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <EditCardDialog card={card} />
                  <DeleteCardButton card={card} />
                </div>
                <div className="mb-4 pr-20">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Front
                  </h4>
                  <p className="text-base">{card.front}</p>
                </div>
                <div className="pr-20">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Back
                  </h4>
                  <p className="text-base">{card.back}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

