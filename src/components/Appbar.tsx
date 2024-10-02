"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "./ui/button";

export default function Appbar() {
  const { publicKey } = useWallet();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const connectWallet = async () => {
      try {
        const res = await axios.post("/api/connect-wallet", {
          publicKey,
        });
        setIsVerified(res.data.user.isVerified);
      } catch (error: any) {
        toast.error(error.response.data.message ?? error.message);
      }
    };
    if (publicKey) {
      connectWallet();
    }
  }, [publicKey]);

  return (
    <div className="flex items-center p-4 bg-black justify-between">
      <div className="font-semibold text-xl text-white cursor-pointer">
        Token<span className="text-yellow-400">Forge</span>
      </div>
      <div className="flex items-center gap-4">
        {publicKey ? <WalletMultiButton /> : <WalletMultiButton />}
        <div>
          {publicKey && isVerified === false && (
            <Button className="px-6 py-2 bg-purple-500 hover:bg-purple-600">
              Verify Wallet
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
