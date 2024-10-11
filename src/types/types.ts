export interface TransactionX {
  id: string;
  createdAt: Date;
  userId: string;
  type: "CREATE_TOKEN" | "AIRDROP" | "SEND_SOL";
  recipientAddress?: string;
  amount?: number;
  token?: {
    name: string;
    symbol: string;
    image: string;
    supply: number;
    userId: string;
    txn: string;
    transactionId: string;
  };
  status: "SUCCESS" | "FAILED";
}
