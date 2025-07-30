import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wallet, ExternalLink } from "lucide-react";
import { getMetaMaskProvider } from "@/lib/metamask";

interface WalletConnectorProps {
  onWalletConnect: (address: string) => void;
}

const WalletConnector = ({ onWalletConnect }: WalletConnectorProps) => {
  const [connecting, setConnecting] = useState(false);

  const connectMetaMask = async () => {
    setConnecting(true);
    try {
      const provider = getMetaMaskProvider();
      if (provider) {
        const accounts = await provider.request({
          method: 'eth_requestAccounts'
        });
        if (accounts.length > 0) {
          onWalletConnect(accounts[0]);
        }
      } else {
        window.open('https://metamask.io/download.html', '_blank');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-card border border-border">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center">
            <Wallet className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Cross-Chain Wallet
            </h1>
            <p className="text-muted-foreground">
              Connect your wallet to start swapping between Ethereum and TON
            </p>
          </div>
          <div className="space-y-4">
            <Button
              onClick={connectMetaMask}
              disabled={connecting}
              variant="default"
              size="lg"
              className="w-full"
            >
              {connecting ? (
                "Connecting..."
              ) : (
                <>
                  <Wallet className="w-5 h-5" />
                  Connect MetaMask
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => window.open('https://metamask.io/download.html', '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
              Install MetaMask
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            Powered by MetaMask SDK
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WalletConnector;