import React, { useEffect } from 'react';
import WalletConnect from './WalletConnect';
import { useTelegram } from './useTelegram';
import './App.css';

function App() {
  const { isReady, user, theme } = useTelegram();

  useEffect(() => {
    // Apply theme class to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            CryptoWallet
          </h1>
          <p className="text-muted-foreground">
            {user ? `Welcome, ${user.first_name}!` : 'Your Telegram Crypto Wallet'}
          </p>
        </div>
        
        <WalletConnect />
      </div>
    </div>
  );
}

export default App;
