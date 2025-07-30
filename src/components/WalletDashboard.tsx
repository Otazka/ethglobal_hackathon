import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getMetaMaskProvider } from "@/lib/metamask";
import { ethers } from "ethers";

interface WalletDashboardProps {
  walletAddress: string;
  onDisconnect: () => void;
}

const WalletDashboard: React.FC<WalletDashboardProps> = ({
  walletAddress,
  onDisconnect,
}) => {
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      setLoading(true);
      try {
        const provider = new ethers.BrowserProvider(getMetaMaskProvider());
        const bal = await provider.getBalance(walletAddress);
        setBalance(ethers.formatEther(bal));
      } catch (err) {
        setBalance(null);
      }
      setLoading(false);
    };
    if (walletAddress) fetchBalance();
  }, [walletAddress]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-card border border-border">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-foreground">Wallet Dashboard</h1>
          <div className="space-y-2">
            <div>
              <span className="font-semibold">Address:</span>
              <span className="ml-2 font-mono break-all">{walletAddress}</span>
            </div>
            <div>
              <span className="font-semibold">ETH Balance:</span>
              <span className="ml-2">
                {loading
                  ? "Loading..."
                  : balance !== null
                  ? `${balance} ETH`
                  : "Error"}
              </span>
            </div>
          </div>
          <Button variant="outline" onClick={onDisconnect}>
            Disconnect
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default WalletDashboard;