import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ExternalLink, 
  ArrowUpDown, 
  CheckCircle, 
  Clock, 
  XCircle 
} from "lucide-react";

interface Transaction {
  id: string;
  type: "swap" | "transfer";
  fromToken: string;
  toToken: string;
  fromAmount: number;
  toAmount: number;
  status: "completed" | "pending" | "failed";
  timestamp: Date;
  txHash: string;
  fromNetwork: string;
  toNetwork: string;
}

const TransactionHistory = () => {
  const transactions: Transaction[] = [
    {
      id: "1",
      type: "swap",
      fromToken: "ETH",
      toToken: "TON",
      fromAmount: 0.5,
      toAmount: 50.75,
      status: "completed",
      timestamp: new Date(Date.now() - 3600000),
      txHash: "0x1234...5678",
      fromNetwork: "Ethereum",
      toNetwork: "TON"
    },
    {
      id: "2",
      type: "swap",
      fromToken: "TON",
      toToken: "USDT",
      fromAmount: 25.0,
      toAmount: 50.0,
      status: "pending",
      timestamp: new Date(Date.now() - 1800000),
      txHash: "0xabcd...efgh",
      fromNetwork: "TON",
      toNetwork: "Ethereum"
    },
    {
      id: "3",
      type: "swap",
      fromToken: "USDT",
      toToken: "ETH",
      fromAmount: 100.0,
      toAmount: 0.062,
      status: "failed",
      timestamp: new Date(Date.now() - 7200000),
      txHash: "0x9876...5432",
      fromNetwork: "Ethereum",
      toNetwork: "Ethereum"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "pending":
        return <Clock className="w-4 h-4 text-warning" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      completed: "default",
      pending: "secondary", 
      failed: "destructive"
    };
    
    return (
      <Badge variant={variants[status] || "secondary"} className="capitalize">
        {status}
      </Badge>
    );
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ago`;
    }
    return `${minutes}m ago`;
  };

  return (
    <Card className="p-6 bg-gradient-card border border-border/50">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Transaction History</h2>
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4" />
            View All
          </Button>
        </div>

        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ArrowUpDown className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No transactions yet</p>
              <p className="text-sm">Your swap history will appear here</p>
            </div>
          ) : (
            transactions.map((tx) => (
              <Card key={tx.id} className="p-4 bg-muted/30 border border-border/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(tx.status)}
                      <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 font-medium">
                        <span>{tx.fromAmount} {tx.fromToken}</span>
                        <span className="text-muted-foreground">→</span>
                        <span>{tx.toAmount} {tx.toToken}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{tx.fromNetwork}</span>
                        <span>→</span>
                        <span>{tx.toNetwork}</span>
                        <span>•</span>
                        <span>{formatTime(tx.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(tx.status)}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`https://etherscan.io/tx/${tx.txHash}`, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </Card>
  );
};

export default TransactionHistory;
