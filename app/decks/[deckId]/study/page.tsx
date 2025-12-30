import { auth } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import { getDeckWithCards, getDeckById } from '@/db/queries/deck-queries';
import { StudyFlashcard } from '@/components/study-flashcard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface StudyPageProps {
  params: Promise<{
    deckId: string;
  }>;
}

export default async function StudyPage({ params }: StudyPageProps) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }
  
  const { deckId } = await params;
  
  // Verify deck ownership
  const deck = await getDeckById(deckId, userId);
  
  if (!deck) {
    notFound();
  }
  
  // Get deck with cards
  const deckWithCards = await getDeckWithCards(deckId, userId);
  
  if (!deckWithCards || !deckWithCards.cards || deckWithCards.cards.length === 0) {
    return (
      <div className="container mx-auto py-8 px-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/decks/${deckId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Deck
          </Link>
        </Button>
        
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">No cards to study</h1>
          <p className="text-muted-foreground mb-6">
            This deck doesn't have any cards yet. Add some cards to start studying!
          </p>
          <Button asChild>
            <Link href={`/decks/${deckId}`}>Go to Deck</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/decks/${deckId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Deck
          </Link>
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Study: {deck.title}</h1>
            <p className="text-muted-foreground">
              {deckWithCards.cards.length} {deckWithCards.cards.length === 1 ? 'card' : 'cards'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Flashcard Component */}
      <StudyFlashcard 
        cards={deckWithCards.cards}
        deckId={deckId}
      />
    </div>
  );
}

