import FeatureCard from "@/components/FeatureCard";
import { CoinsIcon, DollarSignIcon, SendIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center bg-gradient-to-r from-slate-800 to-slate-900  min-h-screen">
      <h1 className="my-4 font-bold text-wrap text-white w-[750px] text-4xl">
        Welcome to Solana LaunchPad, Create your own tokens, airdop yourself and
        send tokens to others
      </h1>

      <div className="my-4 flex items-center gap-5">
        <FeatureCard
          title="Airdop Solana"
          Icon={DollarSignIcon}
          href={"/airdop-solana"}
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
