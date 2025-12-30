import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const { userId } = await auth();
  
  // Redirect authenticated users to dashboard
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center text-center gap-6">
        <h1 className="text-6xl font-bold">FlashyCardy</h1>
        <p className="text-xl text-muted-foreground">your personal flashcard platform</p>
        
        <div className="flex gap-4 mt-4">
          <SignInButton mode="modal" forceRedirectUrl="/dashboard">
            <Button size="lg">Sign In</Button>
          </SignInButton>
          <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
            <Button variant="outline" size="lg">Sign Up</Button>
          </SignUpButton>
        </div>
      </div>
    </div>
  );
}
