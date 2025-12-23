import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { BookOpen, Sparkles, Brain, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Logo/Icon */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
            <div className="relative bg-gradient-to-br from-primary to-purple-600 p-6 rounded-2xl">
              <BookOpen className="w-16 h-16 text-white" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Master Any Subject with{" "}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Smart Flashcards
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
            Create, study, and master flashcards with an intelligent learning system. 
            Track your progress and achieve your learning goals faster.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <SignedOut>
              <Link
                href="/sign-up"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all text-lg font-semibold shadow-lg hover:shadow-xl"
              >
                Get Started Free
                <Sparkles className="w-5 h-5" />
              </Link>
              <Link
                href="/sign-in"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-lg border-2 border-border hover:border-primary hover:bg-muted/50 transition-all text-lg font-semibold"
              >
                Sign In
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all text-lg font-semibold shadow-lg hover:shadow-xl"
              >
                Go to Dashboard
                <Sparkles className="w-5 h-5" />
              </Link>
            </SignedIn>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-12">
            <FeatureCard
              icon={<Brain className="w-8 h-8" />}
              title="Smart Learning"
              description="AI-powered spaced repetition helps you remember more efficiently"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Fast & Easy"
              description="Create flashcards in seconds and study anywhere, anytime"
            />
            <FeatureCard
              icon={<BookOpen className="w-8 h-8" />}
              title="Organized Decks"
              description="Keep your flashcards organized by subject or topic"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
