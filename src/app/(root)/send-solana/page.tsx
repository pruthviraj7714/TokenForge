"use client";
import { isUserVerified } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import axios from "axios";
import { LucideLoader2, SendIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SendSolPage() {
  const { publicKey, sendTransaction } = useWallet();
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const { connection } = useConnection();
  const router = useRouter();

  useEffect(() => {
    if (!publicKey) {
      toast.error("Please Connect Your Wallet First", {
        position: "top-center",
      });
      router.push("/home");
    }
  }, [publicKey]);

  const sendSolana = async () => {
    setSending(true);
    if (!publicKey) {
      toast.error("Wallet not found!");
      setSending(false);
      return;
    }

    const isVerified = await isUserVerified(publicKey?.toString());

    if (!isVerified) {
      toast.error("Please Verify Your Wallet First", {
        position: "top-center",
      });
      setSending(false);
      return;
    }

    const num = Number(amount);
    if (isNaN(num) || amount.includes(" ")) {
      toast.error("Amount must be a valid number");
      setSending(false);
      return;
    }

    if (num <= 0) {
      toast.error("Amount must be greater than 0");
      setSending(false);
      return;
    }

    let isError = false;
    let txError = null;

    try {
      const transaction = new Transaction();

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(publicKey),
          toPubkey: new PublicKey(recipientAddress),
          lamports: num * LAMPORTS_PER_SOL,
        })
      );

      await sendTransaction(transaction, connection);
    } catch (error: any) {
      isError = true;
      txError = error;
    }
    try {
      await axios.post("/api/user/transaction/send-sol", {
        recipientAddress,
        senderAddress: publicKey?.toString(),
        amount: num,
        status: isError ? "Failed" : "Success",
      });

      if (isError) {
        toast.error("Error while sending sol!", {
          position: "top-center",
          description: txError?.message,
        });
      } else {
        toast.success(
          `${num} sol Successfully Transferred to ${recipientAddress}`,
          { position: "top-center" }
        );
      }
    } catch (error: any) {
      toast.error(error.response.data.message ?? error.message);
    }

    setRecipientAddress("");
    setAmount("");
    setSending(false);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 via-slate-800 to-black">
      <Card className="w-[550px] p-8 bg-opacity-90 bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg rounded-lg border border-gray-700">
        <CardTitle className="text-white mb-7">Send solana to others</CardTitle>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <Label className="text-gray-300 ">Recipient Address</Label>
            <Input
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="bg-gray-700 placeholder:text-gray-300 text-gray-300 border-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter Wallet Address of Recipient"
              value={recipientAddress}
            />

            <Label className="text-gray-300 ">Amount</Label>
            <Input
              className="bg-gray-700 placeholder:text-gray-300 text-gray-300 border-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter Amount of Solana to Transfer"
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
            />
          </div>
          <Button
            disabled={sending || !amount}
            onClick={sendSolana}
            className="flex items-center gap-1.5 mt-4 bg-purple-600 hover:bg-purple-700"
          >
            {sending ? (
              <div className="flex items-center gap-1.5">
                <LucideLoader2 className="animate-spin" />
                Sending...
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <SendIcon />
                Send
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
