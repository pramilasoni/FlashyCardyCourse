'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { studyCard } from '@/app/actions/card-actions';
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { InferSelectModel } from 'drizzle-orm';
import type { cards } from '@/db/schema';

type CardType = InferSelectModel<typeof cards>;

interface StudyFlashcardProps {
  cards: CardType[];
  deckId: string;
}

export function StudyFlashcard({ cards: initialCards, deckId }: StudyFlashcardProps) {
  const [cards, setCards] = useState(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [openedCards, setOpenedCards] = useState<Set<string>>(new Set());

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;
  const studiedCount = openedCards.size;

  // Shuffle cards
  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsShuffled(true);
  };

  // Reset to original order
  const handleReset = () => {
    setCards(initialCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsShuffled(false);
    setOpenedCards(new Set());
  };

  // Navigate to next card
  const handleNext = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev < cards.length - 1) {
        setIsFlipped(false);
        return prev + 1;
      }
      return prev;
    });
  }, [cards.length]);

  // Navigate to previous card
  const handlePrevious = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev > 0) {
        setIsFlipped(false);
        return prev - 1;
      }
      return prev;
    });
  }, []);

  // Flip the card
  const handleFlip = useCallback(() => {
    setIsFlipped(prev => {
      const newFlipped = !prev;
      // Track when card is first flipped (opened)
      if (newFlipped) {
        setOpenedCards(prevOpened => {
          const card = cards[currentIndex];
          if (card && !prevOpened.has(card.id)) {
            return new Set(prevOpened).add(card.id);
          }
          return prevOpened;
        });
      }
      return newFlipped;
    });
  }, [cards, currentIndex]);

  // Rate mastery and move to next card
  const handleRateMastery = useCallback(async (masteryLevel: number) => {
    const card = cards[currentIndex];
    if (!card) return;

    try {
      const result = await studyCard({
        cardId: card.id,
        masteryLevel,
      });

      if (result.success) {
        // Update the card in the local state
        setCards(prevCards =>
          prevCards.map(c =>
            c.id === card.id
              ? { ...c, masteryLevel, lastStudied: new Date() }
              : c
          )
        );
        
        // Move to next card or finish
        setCurrentIndex(prev => {
          if (prev < cards.length - 1) {
            setIsFlipped(false);
            return prev + 1;
          }
          setIsFlipped(false);
          return prev;
        });
      }
    } catch (error) {
      console.error('Error rating card:', error);
    }
  }, [currentIndex, cards]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleFlip();
      } else if (e.key === '1') {
        handleRateMastery(1); // Again
      } else if (e.key === '2') {
        handleRateMastery(2); // Hard
      } else if (e.key === '3') {
        handleRateMastery(3); // Good
      } else if (e.key === '4') {
        handleRateMastery(4); // Easy
      } else if (e.key === '5') {
        handleRateMastery(5); // Perfect
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleNext, handlePrevious, handleFlip, handleRateMastery]);

  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">All done! 🎉</h2>
        <p className="text-muted-foreground mb-6">
          You've studied all {cards.length} cards in this deck.
        </p>
        <Button onClick={() => {
          setCurrentIndex(0);
          setIsFlipped(false);
          setOpenedCards(new Set());
        }}>
          Study Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Card {currentIndex + 1} of {cards.length}
          </span>
          <span>
            {studiedCount} {studiedCount === 1 ? 'card' : 'cards'} studied
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="relative">
        <Card
          className={cn(
            "cursor-pointer transition-all duration-300 h-[400px] flex items-center justify-center",
            "hover:shadow-lg"
          )}
          onClick={handleFlip}
        >
          <CardContent className="p-8 w-full h-full flex items-center justify-center">
            <div className="text-center space-y-4 w-full">
              {!isFlipped ? (
                <>
                  <div className="text-sm font-medium text-muted-foreground mb-4">
                    Front
                  </div>
                  <div className="text-2xl font-semibold break-words">
                    {currentCard.front}
                  </div>
                  <div className="text-sm text-muted-foreground mt-8">
                    Click or press Space to flip
                  </div>
                </>
              ) : (
                <>
                  <div className="text-sm font-medium text-muted-foreground mb-4">
                    Back
                  </div>
                  <div className="text-2xl font-semibold break-words">
                    {currentCard.back}
                  </div>
                  <div className="text-sm text-muted-foreground mt-8">
                    Click or press Space to flip back
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          {isShuffled ? (
            <Button variant="outline" onClick={handleReset} size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Order
            </Button>
          ) : (
            <Button variant="outline" onClick={handleShuffle} size="sm">
              <Shuffle className="h-4 w-4 mr-2" />
              Shuffle
            </Button>
          )}
        </div>
      </div>

      {/* Mastery Rating Buttons (only show when flipped) */}
      {isFlipped && (
        <div className="space-y-3">
          <div className="text-center text-sm font-medium text-muted-foreground">
            How well did you know this?
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <Button
              variant="outline"
              onClick={() => handleRateMastery(1)}
              className="h-auto py-4 flex flex-col gap-2"
            >
              <span className="text-lg">😞</span>
              <span className="text-xs">Again (1)</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleRateMastery(2)}
              className="h-auto py-4 flex flex-col gap-2"
            >
              <span className="text-lg">😕</span>
              <span className="text-xs">Hard (2)</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleRateMastery(3)}
              className="h-auto py-4 flex flex-col gap-2"
            >
              <span className="text-lg">😐</span>
              <span className="text-xs">Good (3)</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleRateMastery(4)}
              className="h-auto py-4 flex flex-col gap-2"
            >
              <span className="text-lg">🙂</span>
              <span className="text-xs">Easy (4)</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleRateMastery(5)}
              className="h-auto py-4 flex flex-col gap-2"
            >
              <span className="text-lg">😊</span>
              <span className="text-xs">Perfect (5)</span>
            </Button>
          </div>
          <div className="text-center text-xs text-muted-foreground">
            Press 1-5 on your keyboard for quick rating
          </div>
        </div>
      )}
    </div>
  );
}

