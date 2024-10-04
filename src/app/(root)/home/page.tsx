import FeatureCard from "@/components/FeatureCard";
import { CoinsIcon, DollarSignIcon, SendIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center bg-gradient-to-br from-purple-900 via-slate-800 to-black min-h-screen py-10 px-4">
      <h1 className="my-8 font-extrabold text-center text-white max-w-5xl text-5xl leading-tight drop-shadow-lg">
        Empower your digital journey with Solana: Seamlessly create, manage, and
        send tokens while exploring airdrops and more — all in one secure
        platform.
      </h1>

      <div className="my-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <FeatureCard
          title="Airdrop Solana"
          Icon={DollarSignIcon}
          href={"/airdrop-solana"}
        />
        <FeatureCard
          title="Send Solana"
          Icon={SendIcon}
          href={"/send-solana"}
        />
        <FeatureCard
          title="Create your own Token"
          Icon={CoinsIcon}
          href={"/create-token"}
        />
      </div>
    </div>
  );
}
