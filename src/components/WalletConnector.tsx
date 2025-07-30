import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wallet, ExternalLink, AlertCircle } from "lucide-react";
import { 
  getMetaMaskProvider, 
  isMetaMaskInstalled, 
  isMetaMaskConnected,
  getCurrentAccount 
} from "@/lib/metamask";

interface WalletConnectorProps {
  onWalletConnect: (address: string) => void;
}

const WalletConnector = ({ onWalletConnect }: WalletConnectorProps) => {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean | null>(null);

// Runs once to check installation and listen for MetaMask init
useEffect(() => {
  const checkInstallation = () => {
    const installed = isMetaMaskInstalled();
    setIsInstalled(installed);
    console.log("MetaMask installed:", installed);
  };

  checkInstallation();

  const handleEthereum = () => {
    checkInstallation();
  };

  window.addEventListener("ethereum#initialized", handleEthereum);
  return () => window.removeEventListener("ethereum#initialized", handleEthereum);
}, []);

// Runs once to listen for account changes
useEffect(() => {
  const provider = getMetaMaskProvider();
  if (!provider) return;

  const handleChainChanged = (_chainId: string) => {
    window.location.reload(); // Or trigger state update
  };

  provider.on("chainChanged", handleChainChanged);
  return () => {
    provider.removeListener("chainChanged", handleChainChanged);
  };
}, []);
    
    // Listen for MetaMask installation
    const handleEthereum = () => {
      checkInstallation();
    };

    window.addEventListener('ethereum#initialized', handleEthereum);
    return () => window.removeEventListener('ethereum#initialized', handleEthereum);
  }, []);

  const connectMetaMask = async () => {
    setConnecting(true);
    setError(null);
    
    try {
      console.log('Attempting to connect to MetaMask...');
      
      const provider = getMetaMaskProvider();
      console.log('MetaMask provider:', provider);
      
      if (!provider) {
        const errorMsg = 'MetaMask is not detected. Please install MetaMask and refresh the page.';
        console.error(errorMsg);
        setError(errorMsg);
        return;
      }

      // Check if provider has request method
      if (typeof provider.request !== 'function') {
        const errorMsg = 'MetaMask provider does not have a request method. SDK may not be initialized correctly.';
        console.error(errorMsg);
        setError(errorMsg);
        return;
      }

      // Check if already connected
      const connected = await isMetaMaskConnected();
      console.log('Already connected:', connected);
      
      if (connected) {
        const account = await getCurrentAccount();
        if (account) {
          onWalletConnect(account);
          return;
        }
      }

      // Request accounts
      console.log('Requesting accounts...');
      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      });
      
      console.log('MetaMask accounts:', accounts);
      
      if (accounts && accounts.length > 0) {
        console.log('Successfully connected:', accounts[0]);
        onWalletConnect(accounts[0]);
      } else {
        const errorMsg = 'No accounts found. Please unlock MetaMask and try again.';
        console.error(errorMsg);
        setError(errorMsg);
      }
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      
      let errorMessage = 'Failed to connect to MetaMask.';
      
      if (error.code === 4001) {
        errorMessage = 'Connection rejected by user.';
      } else if (error.code === -32002) {
        errorMessage = 'Please check MetaMask - connection request is pending.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setConnecting(false);
    }
  };

  const handleInstallMetaMask = () => {
    window.open('https://metamask.io/download.html', '_blank');
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

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <Button
              onClick={connectMetaMask}
              disabled={connecting || isInstalled === false}
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
            
            {isInstalled === false && (
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={handleInstallMetaMask}
              >
                <ExternalLink className="w-4 h-4" />
                Install MetaMask
              </Button>
            )}
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
