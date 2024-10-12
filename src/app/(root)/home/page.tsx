import FeatureCard from "@/components/FeatureCard";
import { BitcoinIcon, CoinsIcon, DollarSignIcon, SendIcon } from "lucide-react";
import { SiSolana } from "react-icons/si";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center bg-gradient-to-br from-purple-900 via-slate-800 to-black min-h-screen py-10 px-4 overflow-hidden">
      <div className="absolute top-10 left-20">
        <DollarSignIcon className="text-green-400 opacity-70 w-16 h-16" />
      </div>
      <div className="absolute top-20 right-24">
        <SendIcon className="text-blue-400 opacity-70 w-16 h-16" />
      </div>
      <div className="absolute bottom-16 left-16">
        <CoinsIcon className="text-yellow-400 opacity-70 w-16 h-16" />
      </div>

      <div className="absolute bottom-1/2 right-10">
        <BitcoinIcon className="text-yellow-400 opacity-70 w-16 h-16" />
      </div>

      <div className="absolute text-purple-400 top-1/2 left-14">
        <SiSolana className="opacity-70 w-16 h-16" />
      </div>

      <h1 className="my-8 font-extrabold text-center text-white max-w-4xl text-5xl leading-tight drop-shadow-lg">
        Solana at Your Fingertips
      </h1>

      <p className="text-white text-lg text-center max-w-3xl my-4 tracking-wide opacity-80">
        Seamlessly create, manage, and send tokens while exploring airdrops and
        more—all in one secure platform.
      </p>

      <div className="my-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <FeatureCard
          title="Airdrop Solana"
          Icon={DollarSignIcon}
          href={"/airdrop-solana"}
          description="Get free Solana tokens with our integrated airdrop system."
          featureColor="text-green-400 hover:text-green-500"
        />
        <FeatureCard
          title="Send Solana"
          Icon={SendIcon}
          href={"/send-solana"}
          description="Send Solana securely and quickly, with minimal fees."
          featureColor="text-blue-400 hover:text-blue-500"
        />
        <FeatureCard
          title="Create your own Token"
          Icon={CoinsIcon}
          href={"/create-token"}
          description="Easily create your own token on the Solana blockchain."
          featureColor="text-yellow-400 hover:text-yellow-500"
        />
      </div>
    </div>
  );
}
