"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { LucideLoader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AirdropSolana() {
  const { publicKey } = useWallet();
  const [amount, setAmount] = useState<string>("");
  const [requesting, setRequesting] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (!publicKey) {
      toast.error("Please Connect Your Wallet First", {
        position: "top-center",
      });
      router.push("/home");
    }
  }, [publicKey]);

  const requestAirdrop = async () => {
    setRequesting(true);
    if (!publicKey) {
      toast.error("Wallet is not connected!");
      setRequesting(false);
      return;
    }
    if (!amount) {
      toast.error("Please select an amount to airdrop.");
      setRequesting(false);
      return;
    }

    try {
      await axios.post("/api/user/transaction/airdrop", {
        publicKey,
        amount : Number(amount),
      });
      toast.success(`${amount} sol Successfully Airdroped!`);
  
    } catch (error: any) {
      toast.error(error.response.data.message ?? error.message);
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 via-slate-800 to-black">
      <Card className="w-[550px] p-8 bg-opacity-90 bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg rounded-lg border border-gray-700">
        <CardTitle className="my-6 text-2xl font-semibold text-white">
          Airdrop Solana to Your Account!
        </CardTitle>
        <CardContent className="flex flex-col justify-center space-y-6">
          <div className="my-3">
            <Label className="text-gray-300">Wallet Address</Label>
            <Input
              value={publicKey?.toString()}
              disabled
              className="bg-gray-700 text-white border-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <Label className="text-gray-300">Select Amount</Label>
            <Select value={amount} onValueChange={setAmount}>
              <SelectTrigger className="w-[180px] bg-gray-700 text-white border-none focus:ring-2 focus:ring-purple-500">
                <SelectValue placeholder="Select Amount" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white">
                <SelectItem value="0.01">0.01</SelectItem>
                <SelectItem value="0.1">0.1</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="5">5</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={requestAirdrop}
            disabled={requesting}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            {requesting ? (
              <div className="flex items-center gap-1.5">
                <LucideLoader2 className="animate-spin" />
                Requesting...
              </div>
            ) : (
              "Request Airdrop"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
