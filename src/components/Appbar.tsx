"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";


export default function Appbar() {
  const { publicKey } = useWallet();

  return (
    <div className="flex items-center p-4 bg-black justify-between">
      <div className="font-semibold text-lg text-white cursor-pointer">
        Solana<span className="text-yellow-400">Launchpad</span>
      </div>
      <div>{publicKey ? <WalletMultiButton /> : <WalletMultiButton />}</div>
    </div>
  );
}
