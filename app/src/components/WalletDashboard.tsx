import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  ArrowUpDown, 
  History, 
  Settings, 
  Copy,
  ExternalLink,
  CreditCard,
  Send,
  QrCode
} from "lucide-react";
import SwapInterface from "./SwapInterface";
import TransactionHistory from "./TransactionHistory";
import BalanceCard from "./BalanceCard";
import BuyInterface from "./BuyInterface";
import SendInterface from "./SendInterface";
import RequestInterface from "./RequestInterface";

interface WalletDashboardProps {
  walletAddress: string;
  onDisconnect: () => void;
}

const WalletDashboard = ({ walletAddress, onDisconnect }: WalletDashboardProps) => {
  const [balances] = useState({
    eth: { amount: 2.45, usd: 3920.50 },
    ton: { amount: 125.67, usd: 251.34 }
  });

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Cross-Chain Wallet</h1>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {formatAddress(walletAddress)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyAddress}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={onDisconnect}>
                Disconnect
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Balance Cards */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold">Portfolio</h2>
            <BalanceCard
              token="ETH"
              amount={balances.eth.amount}
              usdValue={balances.eth.usd}
              icon="🔷"
              network="Ethereum"
            />
            <BalanceCard
              token="TON"
              amount={balances.ton.amount}
              usdValue={balances.ton.usd}
              icon="💎"
              network="TON"
            />
            
            <Card className="p-4 bg-card border border-border">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  ${(balances.eth.usd + balances.ton.usd).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Balance</div>
              </div>
            </Card>
          </div>

          {/* Main Interface */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="swap" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="swap" className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4" />
                  Swap
                </TabsTrigger>
                <TabsTrigger value="buy" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Buy
                </TabsTrigger>
                <TabsTrigger value="send" className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Send
                </TabsTrigger>
                <TabsTrigger value="request" className="flex items-center gap-2">
                  <QrCode className="w-4 h-4" />
                  Request
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="swap">
                <SwapInterface />
              </TabsContent>

              <TabsContent value="buy">
                <BuyInterface />
              </TabsContent>

              <TabsContent value="send">
                <SendInterface />
              </TabsContent>

              <TabsContent value="request">
                <RequestInterface />
              </TabsContent>

              <TabsContent value="history">
                <TransactionHistory />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletDashboard;
