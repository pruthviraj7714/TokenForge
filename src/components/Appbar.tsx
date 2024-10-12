"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Loader2, User2Icon } from "lucide-react";
import Link from "next/link";

export default function Appbar() {
  const { publicKey, signMessage } = useWallet();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [profile, setProfile] = useState<string>("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const verifyUser = async () => {
    setIsVerifying(true);

    if (!signMessage) {
      toast.error("Wallet does not support message signing!");
      return;
    }

    const message = `verify ownership of wallet: ${publicKey?.toString()} - ${new Date().toISOString()}`;
    const encodeMessage = new TextEncoder().encode(message);

    let signature;
    try {
      signature = await signMessage(encodeMessage);
    } catch (error: any) {
      toast.error(error.message);
      setIsVerifying(false);
      return;
    }

    try {
      await axios.patch("/api/verify-user", {
        publicKey,
        signature: Array.from(signature),
        message,
      });
      setIsVerified(true);
      toast.success("Successfully Verified!");
    } catch (error: any) {
      toast.error(error?.response.data.message ?? error.message);
    }

    setIsVerifying(false);
  };

  useEffect(() => {
    const connectWallet = async () => {
      try {
        const res = await axios.post("/api/connect-wallet", {
          publicKey,
        });
        setIsVerified(res.data.user.isVerified);
        setProfile(res.data.user.profilePhoto);
      } catch (error: any) {
        toast.error(error.response.data.message ?? error.message);
      }
    };
    if (publicKey) {
      connectWallet();
    }
  }, [publicKey]);

  if (!isMounted) return null;

  return (
    <div className="flex items-center p-4 bg-black justify-between">
      <Link
        href={"/home"}
        className="font-semibold text-2xl text-white cursor-pointer"
      >
        Token<span className="text-yellow-400">Forge</span>
      </Link>
      <div className="flex items-center gap-4">
        {publicKey ? <WalletDisconnectButton /> : <WalletMultiButton />}
        <div>
          {publicKey && !isVerified && (
            <Button
              disabled={isVerifying}
              onClick={verifyUser}
              className="px-6 py-2 bg-purple-500 hover:bg-purple-600"
            >
              {isVerifying ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="animate-spin" />
                  Verifying...
                </span>
              ) : (
                "Verify Wallet"
              )}
            </Button>
          )}
        </div>
        {publicKey && profile && (
          <Link
            href={"/profile"}
            className="flex bg-white h-12 w-12 hover:bg-white/85 hover:text-purple-600 text-purple-500 rounded-full cursor-pointer items-center justify-center hover:opacity-80"
          >
            <img src={profile} alt="Profile_Photo" className="h-full w-full rounded-full object-cover" />
          </Link>
        )}
      </div>
    </div>
  );
}
