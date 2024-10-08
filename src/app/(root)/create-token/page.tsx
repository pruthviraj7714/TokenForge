"use client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  ExtensionType,
  getAssociatedTokenAddress,
  getMintLen,
  LENGTH_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE,
} from "@solana/spl-token";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createInitializeInstruction, pack } from "@solana/spl-token-metadata";
import { toast } from "sonner";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { LucideLoader2, SendIcon } from "lucide-react";

const formSchema = z.object({
  image: z.string().url({ message: "Image must be valid URL" }),
  name: z
    .string()
    .min(2, { message: "Name for token must be at least of 2 characters" })
    .max(18, { message: "Name for token must be maximum of 8 characters" }),
  symbol: z
    .string()
    .min(2, { message: "Symbol must be at least of 2 charcters" })
    .max(6, { message: "Symbol should be no longer than 6 characters" }),
  decimal: z
    .number()
    .min(0, { message: "The Decimals Cannot be less than 0" })
    .max(9, { message: "Decimals Cannot be more than 9" }),
  supply: z.number().min(1, { message: "Put the Amount to mint" }),
});

export default function CreateTokenPage() {
  const { publicKey, sendTransaction, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [createAtaDialogOpen, setCreateAtaDialogOpen] = useState(false);
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [mintAmount, setMintAmount] = useState<number>(0);
  const [mintTokenPublicKey, setMintTokenPublicKey] = useState<string>("");
  const [mintKeyPair, setMintKeyPair] = useState<Keypair>();
  const [minting, setMinting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: "",
      name: "",
      symbol: "",
      decimal: 0,
      supply: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!publicKey) {
      toast.error("Wallet is not connected");
      return;
    }

    setSending(true);
    let isError = false;
    let tx;
    let metaData;
    try {
      const mintKeyPair = Keypair.generate();
      setMintKeyPair(mintKeyPair);
      setMintTokenPublicKey(mintKeyPair.publicKey.toString());
      const transaction = new Transaction();

      metaData = {
        mint: mintKeyPair.publicKey,
        name: values.name,
        symbol: values.symbol,
        uri: values.image,
        additionalMetadata: [],
      };

      const mintLen = getMintLen([ExtensionType.MetadataPointer]);
      const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metaData).length;

      const lamports = await connection.getMinimumBalanceForRentExemption(
        mintLen + metadataLen
      );

      transaction.add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          lamports,
          newAccountPubkey: mintKeyPair.publicKey,
          programId: TOKEN_2022_PROGRAM_ID,
          space: mintLen,
        }),
        createInitializeMetadataPointerInstruction(
          mintKeyPair.publicKey,
          publicKey,
          mintKeyPair.publicKey,
          TOKEN_2022_PROGRAM_ID
        ),
        createInitializeMintInstruction(
          mintKeyPair.publicKey,
          values.decimal,
          publicKey,
          null,
          TOKEN_2022_PROGRAM_ID
        ),
        createInitializeInstruction({
          programId: TOKEN_2022_PROGRAM_ID,
          name: values.name,
          symbol: values.symbol,
          uri: values.image,
          mintAuthority: publicKey,
          updateAuthority: publicKey,
          mint: mintKeyPair.publicKey,
          metadata: mintKeyPair.publicKey,
        })
      );

      transaction.feePayer = publicKey;
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;

      transaction.partialSign(mintKeyPair);
      tx = await sendTransaction(transaction, connection);
      console.log(tx);

      toast.success(
        `${metaData.name} tokens successfully minted! Check it on Solana Explorer: https://explorer.solana.com/tx/${tx}`
      );
      setCreateAtaDialogOpen(true);
    } catch (error: any) {
      isError = true;
      toast.error(error.message);
    }

    try {
      await axios.post("/api/create-token", {
        metaData,
        supply: values.supply,
        walletAddress: publicKey.toString(),
        status: isError ? "Failed" : "Success",
        transaction: isError ? null : tx,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSending(false);
    }
  }

  const createAndMinttoAccount = async () => {
    setMinting(true);
    console.log("Mint KeyPair:", mintKeyPair);

    if (!publicKey || !mintKeyPair || !signTransaction) {
      toast.error("Mint KeyPair is not generated yet");
      setMinting(false);
      return;
    }

    try {
      const transaction = new Transaction();
      const ata = await getAssociatedTokenAddress(
        new PublicKey(mintTokenPublicKey),
        new PublicKey(recipientAddress),
        false,
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      console.log("Generated ATA:", ata);

      const createAtaInstruction = createAssociatedTokenAccountInstruction(
        publicKey,
        ata,
        new PublicKey(recipientAddress),
        new PublicKey(mintTokenPublicKey),
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const mintAmountInBaseUnits =
        mintAmount * Math.pow(10, form.getValues().decimal);
      const mintToInstruction = createMintToInstruction(
        new PublicKey(mintTokenPublicKey),
        ata,
        publicKey,
        mintAmountInBaseUnits
      );

      transaction.add(createAtaInstruction, mintToInstruction);
      transaction.feePayer = publicKey;

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      const signedTransaction = await signTransaction(transaction);
      const txid = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );
      await connection.confirmTransaction(txid);

      toast.success(
        `${mintAmount} tokens successfully minted to ${recipientAddress}`
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setMinting(false);
    }
  };

  useEffect(() => {
    if (!publicKey) {
      toast.error("Please Connect Your Wallet First", {
        position: "top-center",
      });
      router.push("/home");
    }
  }, [publicKey]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 via-slate-800 to-black">
      <Card className="w-[550px] p-8 bg-opacity-90 bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg rounded-lg border border-gray-700">
        <CardTitle className="my-6 text-2xl font-semibold text-white">
          Create your own token
        </CardTitle>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Name</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-gray-700 text-white border-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter name for your token"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Symbol</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-gray-700 text-white border-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter Symbol for your token"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Image</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-gray-700 text-white border-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter image url for your token"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="decimal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Decimal</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-gray-700 text-white border-none focus:ring-2 focus:ring-purple-500"
                        type="number"
                        placeholder="Enter the decimal you want for your token"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="supply"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Supply</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-gray-700 text-white border-none focus:ring-2 focus:ring-purple-500"
                        type="number"
                        placeholder="Enter the amount of tokens to mint"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition duration-300"
                type="submit"
              >
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      {createAtaDialogOpen && (
        <Dialog
          onOpenChange={setCreateAtaDialogOpen}
          open={createAtaDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mint New Coins</DialogTitle>
              <p className="text-gray-400">
                Select the recipient and amount of tokens you want to mint.
              </p>
            </DialogHeader>

            <div className="flex flex-col space-y-4">
              <Label className="text-gray-300">Recipient Wallet Address</Label>
              <Input
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="bg-gray-700 placeholder:text-gray-400 text-gray-300 border-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter the recipient's wallet address"
                value={recipientAddress}
              />

              <Label className="text-gray-300">Amount to Mint</Label>
              <Input
                className="bg-gray-700 placeholder:text-gray-400 text-gray-300 border-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter the amount of tokens to mint"
                onChange={(e) => setMintAmount(Number(e.target.value))}
                value={mintAmount}
              />
            </div>

            <button
              // disabled={minting || !mintAmount}
              onClick={createAndMinttoAccount}
              className="flex items-center gap-1.5 mt-4 bg-purple-600 hover:bg-purple-700"
            >
              {minting ? (
                <div className="flex items-center gap-1.5">
                  <LucideLoader2 className="animate-spin" />
                  Minting...
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <SendIcon />
                  Mint Tokens
                </div>
              )}
            </button>

            <DialogFooter>
              <DialogClose className="text-gray-300">Cancel</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
