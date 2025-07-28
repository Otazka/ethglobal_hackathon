import { useState, useEffect } from "react";
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
  Infinity as InfinityIcon,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from "lucide-react";

const SwapInterface = () => {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("TON");
  const [slippage, setSlippage] = useState(0.5);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const tokens = [
    { symbol: "ETH", name: "Ethereum", icon: "🔷", network: "Ethereum", price: 1600 },
    { symbol: "TON", name: "Toncoin", icon: "💎", network: "TON", price: 31.25 },
    { symbol: "USDT", name: "Tether", icon: "💵", network: "Both", price: 1.00 },
    { symbol: "WETH", name: "Wrapped ETH", icon: "🔶", network: "Ethereum", price: 1600 }
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

  const handleSwap = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) return;
    
    setIsLoading(true);
    // Simulate swap execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Executing swap:", {
      from: fromToken,
      to: toToken,
      amount: fromAmount
    });
    
    setIsLoading(false);
    // Reset form after successful swap
    setFromAmount("");
    setToAmount("");
  };

  const formatUSD = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <Card className="p-6 bg-card border border-border">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Cross-Chain Swap</h2>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <InfinityIcon className="w-3 h-3" />
              1inch Fusion+
            </Badge>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <Card className="p-4 bg-muted/30 border border-border">
            <div className="space-y-3">
              <h3 className="font-medium">Swap Settings</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Slippage Tolerance</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant={slippage === 0.5 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSlippage(0.5)}
                  >
                    0.5%
                  </Button>
                  <Button
                    variant={slippage === 1.0 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSlippage(1.0)}
                  >
                    1.0%
                  </Button>
                  <Button
                    variant={slippage === 2.0 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSlippage(2.0)}
                  >
                    2.0%
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

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

        {/* Swap Button */}
        <Button 
          variant="default" 
          size="lg" 
          className="w-full" 
          disabled={!fromAmount || parseFloat(fromAmount) <= 0 || isLoading}
          onClick={handleSwap}
        >
          {isLoading ? (
            "Processing..."
          ) : !fromAmount || parseFloat(fromAmount) <= 0 ? (
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
