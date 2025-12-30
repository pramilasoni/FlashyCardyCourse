import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function DeckNotFound() {
  return (
    <div className="container mx-auto py-16 px-6">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="bg-muted rounded-full p-6 mb-6">
          <FileQuestion className="h-16 w-16 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Deck Not Found</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          The deck you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Button asChild size="lg">
          <Link href="/dashboard">
            Return to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}

