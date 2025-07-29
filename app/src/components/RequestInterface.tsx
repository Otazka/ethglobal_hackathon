import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  QrCode, 
  Copy, 
  Download, 
  Share2, 
  Zap, 
  Shield, 
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Wallet,
  MessageSquare
} from "lucide-react";

const RequestInterface = () => {
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("ETH");
  const [selectedNetwork, setSelectedNetwork] = useState("ethereum");
  const [memo, setMemo] = useState("");
  const [generatedRequest, setGeneratedRequest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const tokens = [
    { symbol: "ETH", name: "Ethereum", icon: "🔷", network: "ethereum" },
    { symbol: "TON", name: "Toncoin", icon: "💎", network: "ton" },
    { symbol: "USDT", name: "Tether", icon: "💵", network: "both" }
  ];

  const networks = [
    { id: "ethereum", name: "Ethereum", icon: "🔷" },
    { id: "ton", name: "TON Network", icon: "💎" }
  ];

  const getTokenInfo = (symbol: string) => {
    return tokens.find(t => t.symbol === symbol) || tokens[0];
  };

  const getNetworkInfo = (id: string) => {
    return networks.find(n => n.id === id) || networks[0];
  };

  const generateRequest = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    setIsLoading(true);
    // Simulate request generation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const request = {
      id: `req_${Date.now()}`,
      amount: amount,
      token: selectedToken,
      network: selectedNetwork,
      memo: memo,
      walletAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6", // Mock address
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        `${getNetworkInfo(selectedNetwork).id}:${amount}${selectedToken}?memo=${memo}`
      )}`,
      shareLink: `https://wallet.app/request/${Date.now()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };
    
    setGeneratedRequest(request);
    setIsLoading(false);
  };

  const copyRequestLink = () => {
    if (generatedRequest) {
      navigator.clipboard.writeText(generatedRequest.shareLink);
    }
  };

  const copyAddress = () => {
    if (generatedRequest) {
      navigator.clipboard.writeText(generatedRequest.walletAddress);
    }
  };

  const shareRequest = () => {
    if (generatedRequest && navigator.share) {
      navigator.share({
        title: `Payment Request - ${amount} ${selectedToken}`,
        text: `Please send ${amount} ${selectedToken} to complete this payment request.`,
        url: generatedRequest.shareLink
      });
    }
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
          <h2 className="text-xl font-bold">Request Payment</h2>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Secure
            </Badge>
          </div>
        </div>

        {!generatedRequest ? (
          <>
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

            {/* Amount */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <Input
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-xl font-medium"
              />
            </div>

            {/* Memo (Optional) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Memo (Optional)</label>
              <Input
                placeholder="Add a note to this request"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            </div>

            {/* Generate Request Button */}
            <Button 
              variant="default" 
              size="lg" 
              className="w-full" 
              disabled={!amount || parseFloat(amount) <= 0 || isLoading}
              onClick={generateRequest}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 animate-spin" />
                  Generating...
                </div>
              ) : !amount || parseFloat(amount) <= 0 ? (
                "Enter Amount"
              ) : (
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4" />
                  Generate Payment Request
                </div>
              )}
            </Button>
          </>
        ) : (
          <>
            {/* Generated Request Display */}
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Payment Request Generated</h3>
                <p className="text-sm text-muted-foreground">
                  Share this request to receive {amount} {selectedToken}
                </p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center">
                <Card className="p-4 bg-white">
                  <img 
                    src={generatedRequest.qrCode} 
                    alt="Payment QR Code"
                    className="w-48 h-48"
                  />
                </Card>
              </div>

              {/* Request Details */}
              <Card className="p-4 bg-muted/50">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Amount</span>
                    <span className="font-semibold">{generatedRequest.amount} {generatedRequest.token}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Network</span>
                    <span className="text-sm">{getNetworkInfo(generatedRequest.network).name}</span>
                  </div>
                  {generatedRequest.memo && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Memo</span>
                      <span className="text-sm">{generatedRequest.memo}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Expires</span>
                    <span className="text-sm">
                      {new Date(generatedRequest.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={copyRequestLink}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
                <Button variant="outline" onClick={shareRequest}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={copyAddress}>
                  <Wallet className="w-4 h-4 mr-2" />
                  Copy Address
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download QR
                </Button>
              </div>

              {/* New Request Button */}
              <Button 
                variant="default" 
                className="w-full"
                onClick={() => setGeneratedRequest(null)}
              >
                Create New Request
              </Button>
            </div>
          </>
        )}

        <div className="text-center text-xs text-muted-foreground">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Shield className="w-3 h-3" />
            Secure payment requests
          </div>
          <div className="flex items-center justify-center gap-1">
            <Zap className="w-3 h-3" />
            Instant notifications when paid
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RequestInterface; 