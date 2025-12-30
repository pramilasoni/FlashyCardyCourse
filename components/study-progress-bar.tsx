import { Progress } from '@/components/ui/progress';
import { CheckCircle2, BookOpen } from 'lucide-react';

interface StudyProgressBarProps {
  totalCards: number;
  studiedCards: number;
  masteredCards: number;
  progressPercentage: number;
  averageMastery: number;
}

export function StudyProgressBar({
  totalCards,
  studiedCards,
  masteredCards,
  progressPercentage,
  averageMastery,
}: StudyProgressBarProps) {
  if (totalCards === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Study Progress</span>
        </div>
        <span className="text-sm font-semibold text-muted-foreground">
          {progressPercentage}%
        </span>
      </div>
      
      <Progress value={progressPercentage} className="h-2" />
      
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-primary" />
          <span>
            {studiedCards} of {totalCards} studied
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-3 w-3 text-green-600" />
          <span>
            {masteredCards} mastered
          </span>
        </div>
        {averageMastery > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="font-medium">
              Avg: {averageMastery}/5
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

