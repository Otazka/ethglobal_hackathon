import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CreditCard, 
  Banknote, 
  Zap, 
  Shield, 
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard as CreditCardIcon,
  Building2,
  Smartphone
} from "lucide-react";

const BuyInterface = () => {
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("ETH");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isLoading, setIsLoading] = useState(false);

  const tokens = [
    { symbol: "ETH", name: "Ethereum", icon: "🔷", price: 1600 },
    { symbol: "TON", name: "Toncoin", icon: "💎", price: 31.25 },
    { symbol: "USDT", name: "Tether", icon: "💵", price: 1.00 }
  ];

  const paymentMethods = [
    { id: "card", name: "Credit/Debit Card", icon: CreditCardIcon, fee: "2.5%", time: "Instant" },
    { id: "bank", name: "Bank Transfer", icon: Building2, fee: "0.5%", time: "1-3 days" },
    { id: "mobile", name: "Mobile Payment", icon: Smartphone, fee: "1.5%", time: "Instant" }
  ];

  const getTokenInfo = (symbol: string) => {
    return tokens.find(t => t.symbol === symbol) || tokens[0];
  };

  const getPaymentMethodInfo = (id: string) => {
    return paymentMethods.find(p => p.id === id) || paymentMethods[0];
  };

  const calculateTokenAmount = () => {
    if (!amount || parseFloat(amount) <= 0) return "0";
    const usdAmount = parseFloat(amount);
    const tokenPrice = getTokenInfo(selectedToken).price;
    return (usdAmount / tokenPrice).toFixed(4);
  };

  const calculateFee = () => {
    if (!amount || parseFloat(amount) <= 0) return 0;
    const usdAmount = parseFloat(amount);
    const feeRate = parseFloat(getPaymentMethodInfo(paymentMethod).fee.replace("%", "")) / 100;
    return usdAmount * feeRate;
  };

  const handleBuy = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    setIsLoading(true);
    // Simulate purchase execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Executing purchase:", {
      token: selectedToken,
      amount: amount,
      paymentMethod: paymentMethod
    });
    
    setIsLoading(false);
    // Reset form after successful purchase
    setAmount("");
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
          <h2 className="text-xl font-bold">Buy Crypto</h2>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Secure
            </Badge>
          </div>
        </div>

        {/* Token Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Token</label>
          <Select value={selectedToken} onValueChange={setSelectedToken}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tokens.map((token) => (
                <SelectItem key={token.symbol} value={token.symbol}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{token.icon}</span>
                    <span>{token.name}</span>
                    <span className="text-muted-foreground">${token.price}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount (USD)</label>
          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-xl font-medium"
          />
          <div className="text-sm text-muted-foreground">
            You'll receive: {calculateTokenAmount()} {selectedToken}
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Payment Method</label>
          <div className="grid grid-cols-1 gap-2">
            {paymentMethods.map((method) => (
              <Button
                key={method.id}
                variant={paymentMethod === method.id ? "default" : "outline"}
                className="justify-start h-auto p-4"
                onClick={() => setPaymentMethod(method.id)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <method.icon className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">{method.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Fee: {method.fee} • {method.time}
                      </div>
                    </div>
                  </div>
                  {paymentMethod === method.id && (
                    <CheckCircle className="w-5 h-5" />
                  )}
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Fee Breakdown */}
        {amount && parseFloat(amount) > 0 && (
          <Card className="p-4 bg-muted/50">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Amount</span>
                <span>{formatUSD(parseFloat(amount))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Fee ({getPaymentMethodInfo(paymentMethod).fee})</span>
                <span>{formatUSD(calculateFee())}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-medium">
                <span>Total</span>
                <span>{formatUSD(parseFloat(amount) + calculateFee())}</span>
              </div>
            </div>
          </Card>
        )}

        {/* Buy Button */}
        <Button 
          variant="default" 
          size="lg" 
          className="w-full" 
          disabled={!amount || parseFloat(amount) <= 0 || isLoading}
          onClick={handleBuy}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 animate-spin" />
              Processing...
            </div>
          ) : !amount || parseFloat(amount) <= 0 ? (
            "Enter Amount"
          ) : (
            `Buy ${selectedToken} with ${getPaymentMethodInfo(paymentMethod).name}`
          )}
        </Button>

        <div className="text-center text-xs text-muted-foreground">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Shield className="w-3 h-3" />
            Secure payment processing
          </div>
          <div className="flex items-center justify-center gap-1">
            <Zap className="w-3 h-3" />
            Instant delivery to your wallet
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BuyInterface; 