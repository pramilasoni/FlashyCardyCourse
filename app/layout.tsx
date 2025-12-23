import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Button } from "@/components/ui/button";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "FlashyCardyCourse",
  description: "Learn with flashcards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: "hsl(var(--primary))" },
      }}
    >
      <html lang="en" className="dark">
        <body className={`${poppins.variable} antialiased`}>
          <header className="border-b border-border bg-card">
            <div className="container mx-auto flex items-center justify-between py-4 px-6">
              <h1 className="text-xl font-semibold">FlashyCardyCourse</h1>
              <nav className="flex items-center gap-4">
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button>Sign In</Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button variant="secondary">Sign Up</Button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </nav>
            </div>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
