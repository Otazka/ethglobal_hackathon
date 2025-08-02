import React, { useState } from 'react';
import { 
  Send, 
  Download, 
  RefreshCw, 
  Copy, 
  ExternalLink,
  Eye,
  EyeOff,
  Users
} from './lucide-react.jsx';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useMetaMask } from './useMetaMask';
import { useTelegram } from './useTelegram';
import SendTransaction from './SendTransaction';
import ReceiveTransaction from './ReceiveTransaction';
import SwapTokens from './SwapTokens';
import SocialFeatures from './SocialFeatures';

const WalletDashboard = () => {
  const { account, balance, getBalance, disconnectWallet } = useMetaMask();
  const { haptic } = useTelegram();
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      haptic.notification('success');
    } catch (error) {
      console.error('Failed to copy:', error);
      haptic.notification('error');
    }
  };

  const handleRefreshBalance = async () => {
    setIsRefreshing(true);
    haptic.impact('light');
    try {
      await getBalance();
    } catch (error) {
      console.error('Error refreshing balance:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const openEtherscan = () => {
    const url = `https://etherscan.io/address/${account}`;
    window.open(url, '_blank');
  };

  if (activeTab === 'send') {
    return <SendTransaction onBack={() => setActiveTab('dashboard')} />;
  }

  if (activeTab === 'receive') {
    return <ReceiveTransaction onBack={() => setActiveTab('dashboard')} />;
  }

  if (activeTab === 'swap') {
    return <SwapTokens onBack={() => setActiveTab('dashboard')} />;
  }

  if (activeTab === 'social') {
    return <SocialFeatures onBack={() => setActiveTab('dashboard')} />;
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Account Info */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Wallet Address</CardTitle>
              <CardDescription className="flex items-center gap-2">
                {formatAddress(account)}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(account)}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={openEtherscan}
                  className="h-6 w-6 p-0"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </CardDescription>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Connected
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Balance Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Balance</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
                className="h-8 w-8 p-0"
              >
                {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefreshBalance}
                disabled={isRefreshing}
                className="h-8 w-8 p-0"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">
              {showBalance ? `${parseFloat(balance).toFixed(4)} ETH` : '••••••••'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Ethereum Mainnet
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => {
            haptic.impact('light');
            setActiveTab('send');
          }}
          className="h-16 flex flex-col gap-1"
        >
          <Send className="h-5 w-5" />
          <span className="text-sm">Send</span>
        </Button>
        <Button
          onClick={() => {
            haptic.impact('light');
            setActiveTab('receive');
          }}
          variant="outline"
          className="h-16 flex flex-col gap-1"
        >
          <Download className="h-5 w-5" />
          <span className="text-sm">Receive</span>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => {
            haptic.impact('light');
            setActiveTab('swap');
          }}
          variant="outline"
          className="h-16 flex flex-col gap-1"
        >
          <RefreshCw className="h-5 w-5" />
          <span className="text-sm">Swap</span>
        </Button>
        <Button
          onClick={() => {
            haptic.impact('light');
            setActiveTab('social');
          }}
          variant="outline"
          className="h-16 flex flex-col gap-1"
        >
          <Users className="h-5 w-5" />
          <span className="text-sm">Friends</span>
        </Button>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              haptic.impact('light');
              disconnectWallet();
            }}
          >
            Disconnect Wallet
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletDashboard;

