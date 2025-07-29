import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Send, 
  Copy, 
  Scan, 
  Zap, 
  Shield, 
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Wallet,
  Network
} from "lucide-react";

const SendInterface = () => {
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("ETH");
  const [selectedNetwork, setSelectedNetwork] = useState("ethereum");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [memo, setMemo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const tokens = [
    { symbol: "ETH", name: "Ethereum", icon: "🔷", balance: 2.45, network: "ethereum" },
    { symbol: "TON", name: "Toncoin", icon: "💎", balance: 125.67, network: "ton" },
    { symbol: "USDT", name: "Tether", icon: "💵", balance: 1000.00, network: "both" }
  ];

  const networks = [
    { id: "ethereum", name: "Ethereum", icon: "🔷", gasEstimate: "0.002 ETH" },
    { id: "ton", name: "TON Network", icon: "💎", gasEstimate: "0.01 TON" }
  ];

  const getTokenInfo = (symbol: string) => {
    return tokens.find(t => t.symbol === symbol) || tokens[0];
  };

  const getNetworkInfo = (id: string) => {
    return networks.find(n => n.id === id) || networks[0];
  };

  const validateAddress = (address: string, network: string) => {
    if (network === "ethereum") {
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    } else if (network === "ton") {
      return /^[0-9a-zA-Z_-]{48}$/.test(address);
    }
    return true;
  };

  const isValidAddress = recipientAddress && validateAddress(recipientAddress, selectedNetwork);
  const isValidAmount = amount && parseFloat(amount) > 0 && parseFloat(amount) <= getTokenInfo(selectedToken).balance;

  const handleSend = async () => {
    if (!isValidAddress || !isValidAmount) return;
    
    setIsLoading(true);
    // Simulate send execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Executing send:", {
      token: selectedToken,
      amount: amount,
      recipient: recipientAddress,
      network: selectedNetwork,
      memo: memo
    });
    
    setIsLoading(false);
    // Reset form after successful send
    setAmount("");
    setRecipientAddress("");
    setMemo("");
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(recipientAddress);
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
          <h2 className="text-xl font-bold">Send Crypto</h2>
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
                    <span className="text-muted-foreground">
                      Balance: {token.balance} {token.symbol}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Network Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Network</label>
          <div className="grid grid-cols-2 gap-2">
            {networks.map((network) => (
              <Button
                key={network.id}
                variant={selectedNetwork === network.id ? "default" : "outline"}
                className="justify-start h-auto p-4"
                onClick={() => setSelectedNetwork(network.id)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{network.icon}</span>
                    <div className="text-left">
                      <div className="font-medium">{network.name}</div>
                      <div className="text-sm text-muted-foreground">
                        ~{network.gasEstimate}
                      </div>
                    </div>
                  </div>
                  {selectedNetwork === network.id && (
                    <CheckCircle className="w-5 h-5" />
                  )}
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Recipient Address */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Recipient Address</label>
          <div className="relative">
            <Input
              placeholder="Enter wallet address"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className={`pr-12 ${!isValidAddress && recipientAddress ? 'border-red-500' : ''}`}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Scan className="w-3 h-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={copyAddress}
                disabled={!recipientAddress}
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>
          {recipientAddress && !isValidAddress && (
            <div className="flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="w-3 h-3" />
              Invalid address format for {getNetworkInfo(selectedNetwork).name}
            </div>
          )}
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Amount</label>
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={() => setAmount(getTokenInfo(selectedToken).balance.toString())}
            >
              Max: {getTokenInfo(selectedToken).balance} {selectedToken}
            </button>
          </div>
          <Input
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-xl font-medium"
          />
          {amount && parseFloat(amount) > getTokenInfo(selectedToken).balance && (
            <div className="flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="w-3 h-3" />
              Insufficient balance
            </div>
          )}
        </div>

        {/* Memo (Optional) */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Memo (Optional)</label>
          <Textarea
            placeholder="Add a note to this transaction"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows={2}
          />
        </div>

        {/* Transaction Summary */}
        {isValidAmount && isValidAddress && (
          <Card className="p-4 bg-muted/50">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Amount</span>
                <span>{amount} {selectedToken}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Network Fee</span>
                <span>{getNetworkInfo(selectedNetwork).gasEstimate}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-medium">
                <span>Total</span>
                <span>{amount} {selectedToken} + {getNetworkInfo(selectedNetwork).gasEstimate}</span>
              </div>
            </div>
          </Card>
        )}

        {/* Send Button */}
        <Button 
          variant="default" 
          size="lg" 
          className="w-full" 
          disabled={!isValidAddress || !isValidAmount || isLoading}
          onClick={handleSend}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 animate-spin" />
              Sending...
            </div>
          ) : !isValidAddress || !isValidAmount ? (
            "Enter Valid Details"
          ) : (
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Send {amount} {selectedToken}
            </div>
          )}
        </Button>

        <div className="text-center text-xs text-muted-foreground">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Shield className="w-3 h-3" />
            Secure cross-chain transfers
          </div>
          <div className="flex items-center justify-center gap-1">
            <Zap className="w-3 h-3" />
            Fast confirmation on {getNetworkInfo(selectedNetwork).name}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SendInterface; 