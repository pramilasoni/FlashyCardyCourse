import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BookOpen, Plus, Brain, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const { userId } = await auth();
  
  // Redirect to home if not authenticated
  if (!userId) {
    redirect("/");
  }

  const user = await currentUser();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome back, {user?.firstName || "there"}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Ready to continue your learning journey?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Decks"
            value="0"
            icon={<BookOpen className="w-6 h-6" />}
            gradient="from-blue-500 to-cyan-500"
          />
          <StatsCard
            title="Total Cards"
            value="0"
            icon={<Brain className="w-6 h-6" />}
            gradient="from-purple-500 to-pink-500"
          />
          <StatsCard
            title="Cards Studied"
            value="0"
            icon={<TrendingUp className="w-6 h-6" />}
            gradient="from-orange-500 to-red-500"
          />
          <StatsCard
            title="Streak Days"
            value="0"
            icon={<span className="text-2xl">🔥</span>}
            gradient="from-green-500 to-emerald-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ActionCard
              title="Create New Deck"
              description="Start a new flashcard collection"
              icon={<Plus className="w-8 h-8" />}
              href="/dashboard/decks/new"
            />
            <ActionCard
              title="Study Now"
              description="Review your flashcards"
              icon={<Brain className="w-8 h-8" />}
              href="/dashboard/study"
            />
            <ActionCard
              title="Browse Decks"
              description="View all your decks"
              icon={<BookOpen className="w-8 h-8" />}
              href="/dashboard/decks"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">
              No recent activity yet. Create your first deck to get started!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stats Card Component
function StatsCard({
  title,
  value,
  icon,
  gradient,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`bg-gradient-to-br ${gradient} p-3 rounded-lg text-white`}>
          {icon}
        </div>
      </div>
      <h3 className="text-muted-foreground text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
}

// Action Card Component
function ActionCard({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <a
      href={href}
      className="bg-card border border-border rounded-lg p-6 hover:border-primary hover:shadow-lg transition-all group"
    >
      <div className="flex items-start gap-4">
        <div className="text-primary group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </a>
  );
}
