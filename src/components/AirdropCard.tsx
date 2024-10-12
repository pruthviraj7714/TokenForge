import { Calendar, PlusCircle, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TransactionX } from "@/types/types"
import { formatDistanceToNow } from "date-fns"


export default function AirdropCard({ transaction }: { transaction: TransactionX }) {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-none text-white hover:bg-white/20 transition-colors my-1">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-green-400/20 p-2 rounded-full">
              <PlusCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-lg font-semibold">{transaction.amount} SOL</p>
              <p className="text-sm text-gray-300">Airdrop</p>
            </div>
          </div>
          <Badge 
            variant={transaction.status === "SUCCESS" ? "secondary" : "destructive"}
            className="flex items-center space-x-1"
          >
            {transaction.status === "SUCCESS" ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            <span>{transaction.status}</span>
          </Badge>
        </div>
        <div className="mt-3 flex items-center text-sm text-gray-300">
          <Calendar className="w-4 h-4 mr-2" />
          {formatDistanceToNow(transaction.createdAt, {addSuffix :  true})}
        </div>
      </CardContent>
    </Card>
  )
}