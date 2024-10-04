"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Wallet2Icon,
  ShieldCheckIcon,
  CoinsIcon,
  SendIcon,
  DollarSignIcon,
  UsersIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-800 to-black text-white">
      <header className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center">
          Token<span className="text-yellow-400">Forge</span>
        </h1>
        <p className="text-xl text-center mt-2">Your All-in-One Solana dApp</p>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-4">
            Unleash the Power of Solana
          </h2>
          <p className="text-xl mb-8">
            Connect, verify, airdrop, send, and create tokens with ease
          </p>
          <Button
            onClick={() => router.push("/home")}
            size="lg"
            className="bg-white text-purple-600 text-md hover:bg-purple-600 hover:text-white"
          >
            Launch App
          </Button>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Wallet2Icon className="h-8 w-8" />}
            title="Connect Wallet"
            description="Seamlessly connect your Solana wallet to access all features"
          />
          <FeatureCard
            icon={<ShieldCheckIcon className="h-8 w-8" />}
            title="Verify Wallet"
            description="Secure your account with message signing verification"
          />
          <FeatureCard
            icon={<DollarSignIcon className="h-8 w-8" />}
            title="Airdrop SOL"
            description="Receive SOL tokens directly into your connected wallet"
          />
          <FeatureCard
            icon={<SendIcon className="h-8 w-8" />}
            title="Send Solana"
            description="Transfer SOL tokens quickly and efficiently"
          />
          <FeatureCard
            icon={<CoinsIcon className="h-8 w-8" />}
            title="Create Tokens"
            description="Mint your own custom tokens on the Solana blockchain"
          />
          <FeatureCard
            icon={<UsersIcon className="h-8 w-8" />}
            title="Send to Others"
            description="Easily send your created tokens to other Solana wallets"
          />
        </section>
      </main>

      <footer className="container mx-auto py-8 text-center">
        <p>&copy; 2024 TokenForge. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <Card className="bg-purple-400 border-none">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
    </Card>
  );
}
