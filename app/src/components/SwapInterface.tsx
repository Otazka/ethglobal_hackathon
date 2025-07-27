import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowUpDown, 
  Settings, 
  Zap, 
  Shield, 
  Clock,
  ChevronDown,
  Infinity as InfinityIcon
} from "lucide-react";

const SwapInterface = () => {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("TON");
  const [slippage, setSlippage] = useState(0.5);

  const tokens = [
    { symbol: "ETH", name: "Ethereum", icon: "🔷", network: "Ethereum" },
    { symbol: "TON", name: "Toncoin", icon: "💎", network: "TON" },
    { symbol: "USDT", name: "Tether", icon: "💵", network: "Both" },
    { symbol: "WETH", name: "Wrapped ETH", icon: "🔶", network: "Ethereum" }
  ];

  const swapTokens = () => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const getTokenInfo = (symbol: string) => {
    return tokens.find(t => t.symbol === symbol) || tokens[0];
  };

  return (
    <Card className="p-6 bg-gradient-card border border-border/50">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Cross-Chain Swap</h2>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <InfinityIcon className="w-3 h-3" />
              1inch Fusion+
            </Badge>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* From Token */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">From</span>
            <span className="text-muted-foreground">Balance: 2.45 ETH</span>
          </div>
          
          <Card className="p-4 bg-muted/50">
            <div className="flex items-center gap-4">
              <Button variant="outline" className="flex items-center gap-2 min-w-[120px]">
                <span className="text-lg">{getTokenInfo(fromToken).icon}</span>
                <span className="font-medium">{fromToken}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
              
              <Input
                type="number"
                placeholder="0.0"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="text-right text-xl font-medium bg-transparent border-none p-0 focus-visible:ring-0"
              />
            </div>
            
            <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
              <span>{getTokenInfo(fromToken).network}</span>
              <span>~$0.00</span>
            </div>
          </Card>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={swapTokens}
            className="rounded-full p-2 h-10 w-10 border-2 hover:rotate-180 transition-transform duration-300"
          >
            <ArrowUpDown className="w-4 h-4" />
          </Button>
        </div>

        {/* To Token */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">To</span>
            <span className="text-muted-foreground">Balance: 125.67 TON</span>
          </div>
          
          <Card className="p-4 bg-muted/50">
            <div className="flex items-center gap-4">
              <Button variant="outline" className="flex items-center gap-2 min-w-[120px]">
                <span className="text-lg">{getTokenInfo(toToken).icon}</span>
                <span className="font-medium">{toToken}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
              
              <Input
                type="number"
                placeholder="0.0"
                value={toAmount}
                onChange={(e) => setToAmount(e.target.value)}
                className="text-right text-xl font-medium bg-transparent border-none p-0 focus-visible:ring-0"
                readOnly
              />
            </div>
            
            <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
              <span>{getTokenInfo(toToken).network}</span>
              <span>~$0.00</span>
            </div>
          </Card>
        </div>

        <Separator />

        {/* Swap Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Zap className="w-4 h-4" />
              Best Route
            </span>
            <span className="font-medium">1inch Fusion+</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              Estimated Time
            </span>
            <span className="font-medium">2-5 minutes</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-4 h-4" />
              Slippage Tolerance
            </span>
            <Badge variant="secondary">{slippage}%</Badge>
          </div>
        </div>

        {/* Swap Button */}
        <Button 
          variant="gradient" 
          size="lg" 
          className="w-full" 
          disabled={!fromAmount || parseFloat(fromAmount) <= 0}
        >
          {!fromAmount || parseFloat(fromAmount) <= 0 ? (
            "Enter Amount"
          ) : (
            `Swap ${fromToken} for ${toToken}`
          )}
        </Button>

        <div className="text-center text-xs text-muted-foreground">
          Cross-chain swaps are powered by 1inch Fusion+ technology
        </div>
      </div>
    </Card>
  );
};

export default SwapInterface;
