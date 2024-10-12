"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Coins, Send, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import AirdropCard from "@/components/AirdropCard";
import { useRouter } from "next/navigation";
import { TransactionX } from "@/types/types";
import SendSolCard from "@/components/SendSolCard";
import CreateTokenCard from "@/components/CreateTokenCard";


type Tab = "Created Tokens" | "Airdrop" | "Sent Sol";

const TABS: Tab[] = ["Created Tokens", "Airdrop", "Sent Sol"];

export default function ProfilePage() {
  const { publicKey, connecting, connected } = useWallet();
  const [currentTab, setCurrentTab] = useState<Tab>("Airdrop");
  const [transactions, setTransactions] = useState<any>([]);
  const [profile, setProfile] = useState<string>("");
  const router = useRouter();



  const getAllTransactions = async () => {
    try {
      const res = await axios.get(
        `/api/user/transaction/all?walletAddress=${publicKey?.toString()}`
      );
      setTransactions(res.data.transactions);
      setProfile(res.data.profilePhoto);
    } catch (error: any) {
      toast.error(error.response.data.message ?? error.message);
    }
  };
  useEffect(() => {
    if (!publicKey) {
      toast.error("Please Connect Your Wallet First", {
        position: "top-center",
      });
      router.push("/home");
    }
    getAllTransactions();
  }, [publicKey]);

  if (connecting || !connected) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-slate-800 to-black">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-800 to-black p-6">
      <div className="max-w-4xl mx-auto space-y-8 pt-10">
        <Card className="bg-white/10 backdrop-blur-lg border-none text-white">
          <CardHeader className="flex flex-row items-center space-x-4">
            <div className="w-20 h-20">
              <img
                src={profile}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <CardTitle className="text-2xl">Welcome to TokenForge</CardTitle>
              <p className="text-sm text-gray-300 mt-1">
                Wallet Public Key: {publicKey?.toString()}
              </p>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-white/10 backdrop-blur-lg border-none text-white">
          <CardHeader>
            <CardTitle className="text-xl">Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={currentTab}
              onValueChange={(value) => setCurrentTab(value as Tab)}
            >
              <TabsList className="grid w-full grid-cols-3 bg-white/10">
                {TABS.map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className={`data-[state=active]:bg-white/20 text-white ${
                      currentTab === "Airdrop"
                        ? "data-[state=active]:text-green-400"
                        : currentTab === "Sent Sol"
                        ? "data-[state=active]:text-sky-500"
                        : "data-[state=active]:text-yellow-400"
                    }`}
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
              {TABS.map((tab) => (
                <TabsContent key={tab} value={tab} className="mt-4">
                  <Card className="bg-white/5 border-none">
                    <CardContent className="p-6">
                      {tab === "Created Tokens" && (
                        <div className="flex items-center space-x-2">
                          <div className="flex flex-col w-full">
                            {transactions &&
                            transactions.filter(
                              (tx: TransactionX) => tx.type === "CREATE_TOKEN"
                            ).length > 0 ? (
                              transactions
                                .filter(
                                  (tx: TransactionX) =>
                                    tx.type === "CREATE_TOKEN"
                                )
                                .map((t: TransactionX) => (
                                  <CreateTokenCard transaction={t} key={t.id} />
                                ))
                            ) : (
                              <div className="flex items-center gap-2">
                                <Coins className="w-6 h-6 text-yellow-400" />
                                <span className="text-white">
                                  Your created tokens will appear here
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {tab === "Airdrop" && (
                        <div className="flex flex-col items-center space-x-2">
                          <div className="flex flex-col w-full">
                            {transactions &&
                            transactions.filter(
                              (tx: TransactionX) => tx.type === "AIRDROP"
                            ).length > 0 ? (
                              transactions
                                .filter(
                                  (tx: TransactionX) => tx.type === "AIRDROP"
                                )
                                .map((t: TransactionX) => (
                                  <AirdropCard transaction={t} key={t.id} />
                                ))
                            ) : (
                              <div className="flex items-center gap-2">
                                <PlusCircle className="w-6 h-6 text-green-400" />
                                <span className="text-white">
                                  Your airdrop history will appear here
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {tab === "Sent Sol" && (
                        <div className="flex items-center space-x-2">
                          <div className="w-full flex flex-col">
                            {transactions &&
                            transactions.filter(
                              (tx: TransactionX) => tx.type === "SEND_SOL"
                            ).length > 0 ? (
                              transactions
                                .filter(
                                  (tx: TransactionX) => tx.type === "SEND_SOL"
                                )
                                .map((t: TransactionX) => (
                                  <SendSolCard transaction={t} key={t.id} />
                                ))
                            ) : (
                              <div className="flex items-center gap-2">
                                <Send className="w-6 h-6 text-blue-400" />
                                <span className="text-white">
                                  Your sent SOL transactions will appear here
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
