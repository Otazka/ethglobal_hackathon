import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { Button } from '@/components/ui/button';
import { showTelegramAlert, hapticFeedback } from '@/lib/telegram';

const isTelegramWebView =
  typeof window.Telegram !== 'undefined' &&
  window.Telegram.WebApp !== undefined;

const platform = window.Telegram?.WebApp?.platform;
// platform can be 'android', 'ios', 'tdesktop', or 'web'

if (!window.ethereum && isTelegramWebView) {
  <Button
  variant="outline"
  onClick={() => {
    window.open(window.location.href, '_blank');
  }}
>
  Open in Browser
</Button>
  window.open(window.location.href, '_blank'); // Opens in system browser
}

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, isLoading } = useConnect({
    connector: injected(),
    onError(error) {
      console.error(error);
      showTelegramAlert("Failed to connect MetaMask.");
    },
    onSuccess(data) {
      showTelegramAlert(`Connected: ${data.account.slice(0, 6)}...${data.account.slice(-4)}`);
      hapticFeedback('medium');
    },
  });

  const { disconnect } = useDisconnect();

  return (
    <div className="flex flex-col items-center space-y-4">
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
          onClick={() => {
            hapticFeedback('light');
            connect();
          }}
          disabled={isLoading}
        >
          {isLoading ? 'Connecting...' : 'Connect MetaMask'}
        </Button>
      )}
    </div>
  );
}