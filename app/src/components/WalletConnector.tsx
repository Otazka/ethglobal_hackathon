import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wallet, ExternalLink, Shield, User } from "lucide-react";
import { showTelegramAlert, hapticFeedback } from "@/lib/telegram";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
      selectedAddress?: string;
      isMetaMask?: boolean;
    };
  }
}

interface WalletConnectorProps {
  onWalletConnect: (address: string, signature?: string) => void;
}

const WalletConnector = ({ onWalletConnect }: WalletConnectorProps) => {
  const [connecting, setConnecting] = useState(false);
  const [signing, setSigning] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState<boolean>(false);

  useEffect(() => {
    const checkMetaMaskAvailability = async () => {
      const { ethereum } = window;
      if (ethereum && ethereum.isMetaMask) {
        try {
          // Prefer isConnected() if available, otherwise fallback to eth_accounts
          let isConnected = false;
          if (typeof ethereum.isConnected === "function") {
            isConnected = ethereum.isConnected();
          } else {
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            isConnected = accounts.length > 0;
          }
          setIsMetaMaskAvailable(isConnected || ethereum.isMetaMask);
        } catch {
          setIsMetaMaskAvailable(false);
        }
      } else {
        setIsMetaMaskAvailable(false);
      }
    };

    checkMetaMaskAvailability();
  }, []);

  const connectMetaMask = async () => {
    setConnecting(true);
    hapticFeedback('medium');

    try {
      if (isMetaMaskAvailable && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });

        if (accounts.length > 0) {
          const address = accounts[0];
          setConnectedAddress(address);
          showTelegramAlert(`Connected to ${address.slice(0, 6)}...${address.slice(-4)}`);
          await requestSignature(address);
        }
      } else {
        showTelegramAlert("MetaMask not detected. Please install MetaMask.");
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      showTelegramAlert("Failed to connect MetaMask. Please try again.");
    } finally {
      setConnecting(false);
    }
  };

  const requestSignature = async (address: string) => {
    setSigning(true);
    hapticFeedback('light');
    
    try {
      // Create a message for the user to sign
      const message = `Login to Ether to TON Bridge\n\nTimestamp: ${Date.now()}\nAddress: ${address}`;
      
      // Request signature
      const signature = await window.ethereum!.request({
        method: 'personal_sign',
        params: [message, address]
      });
      
      showTelegramAlert("Login successful! Welcome to the bridge.");
      
      // Call the parent component with address and signature
      onWalletConnect(address, signature);
      
    } catch (error) {
      console.error('Failed to sign message:', error);
      if (error.code === 4001) {
        showTelegramAlert("Login cancelled by user");
      } else {
        showTelegramAlert("Failed to complete login. Please try again.");
      }
    } finally {
      setSigning(false);
    }
  };

  const disconnectWallet = () => {
    hapticFeedback('light');
    setConnectedAddress(null);
    showTelegramAlert("Wallet disconnected");
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
              Login with MetaMask
            </h1>
            <p className="text-muted-foreground">
              Connect your MetaMask wallet to access the bridge
            </p>
          </div>

          {connectedAddress ? (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-center space-x-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-mono">
                    {connectedAddress.slice(0, 6)}...{connectedAddress.slice(-4)}
                  </span>
                </div>
              </div>
              
              <Button
                onClick={() => requestSignature(connectedAddress)}
                disabled={signing}
                variant="default"
                size="lg"
                className="w-full"
              >
                {signing ? (
                  "Signing..."
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Sign to Login
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={disconnectWallet}
              >
                Disconnect Wallet
              </Button>
            </div>
          ) : (
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
                    <Wallet className="w-5 h-5 mr-2" />
                    Connect MetaMask
                  </>
                )}
              </Button>

              {!isMetaMaskAvailable && (
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    hapticFeedback('light');
                    window.open('https://metamask.io/download.html', '_blank');
                    showTelegramAlert("Redirecting to MetaMask download page...");
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Install MetaMask
                </Button>
              )}
            </div>
          )}

          <div className="text-xs text-muted-foreground space-y-2">
            <div>🔐 Secure login with MetaMask signature</div>
            <div>Powered by 1inch Fusion+ Cross-chain Technology</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WalletConnector;
