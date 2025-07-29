import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { Button } from '@/components/ui/button';
import { showTelegramAlert, hapticFeedback } from '@/lib/telegram';

const isTelegramWebView =
  typeof window.Telegram !== 'undefined' &&
  window.Telegram.WebApp !== undefined;

const platform = window.Telegram?.WebApp?.platform;
// platform can be 'android', 'ios', 'tdesktop', or 'web'

// Check if we're in Telegram WebView and MetaMask is not available
const shouldShowBrowserButton = !window.ethereum && isTelegramWebView;

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();

  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    hapticFeedback('light');
    connect({ connector: injected() });
  };

  // Show success/error messages when connection state changes
  React.useEffect(() => {
    if (isConnected && address) {
      showTelegramAlert(`Connected: ${address.slice(0, 6)}...${address.slice(-4)}`);
      hapticFeedback('medium');
    }
  }, [isConnected, address]);

  return (
    <div className="flex flex-col items-center space-y-4">
      {shouldShowBrowserButton && (
        <Button
          variant="outline"
          onClick={() => {
            window.open(window.location.href, '_blank');
          }}
        >
          Open in Browser
        </Button>
      )}
      
      {isConnected ? (
        <>
          <p className="text-sm font-mono">
            Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
          <Button variant="outline" onClick={() => disconnect()}>
            Disconnect
          </Button>
        </>
      ) : (
        <Button
          onClick={handleConnect}
          disabled={isPending}
        >
          {isPending ? 'Connecting...' : 'Connect MetaMask'}
        </Button>
      )}
    </div>
  );
}