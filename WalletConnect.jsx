import React from 'react';
import { Wallet, AlertCircle, Loader2 } from './lucide-react.jsx';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { useMetaMask } from './useMetaMask';
import { useTelegram } from './useTelegram';
import WalletDashboard from './WalletDashboard';

const WalletConnect = () => {
  const {
    account,
    isConnected,
    isLoading,
    error,
    isMetaMaskInstalled,
    connectWallet,
  } = useMetaMask();

  const { haptic } = useTelegram();

  const handleConnect = async () => {
    haptic.impact('light');
    await connectWallet();
  };

  if (!isMetaMaskInstalled()) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Wallet className="h-6 w-6" />
            MetaMask Required
          </CardTitle>
          <CardDescription>
            Please install MetaMask to use this wallet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => window.open('https://metamask.io/download/', '_blank')}
            className="w-full"
          >
            Install MetaMask
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isConnected) {
    return <WalletDashboard />;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Wallet className="h-6 w-6" />
          Connect Wallet
        </CardTitle>
        <CardDescription>
          Connect your MetaMask wallet to get started
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button 
          onClick={handleConnect}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-4 w-4" />
              Connect MetaMask
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WalletConnect;

