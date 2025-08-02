import React, { useState } from 'react';
import { ArrowLeft, Users, Send, Copy, Share } from './lucide-react.jsx';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useMetaMask } from './useMetaMask';
import { useTelegram } from './useTelegram';

const RequestCrypto = ({ onBack }) => {
  const { account } = useMetaMask();
  const { haptic, user, openTelegramLink } = useTelegram();
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('ETH');
  const [message, setMessage] = useState('');
  const [requestLink, setRequestLink] = useState('');

  const generateRequestLink = () => {
    const requestData = {
      to: account,
      amount: amount,
      currency: currency,
      message: message,
      from: user?.username || user?.first_name || 'Friend',
    };

    // Create a payment request URL
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      action: 'pay',
      address: account,
      amount: amount,
      token: currency,
      message: encodeURIComponent(message),
    });

    const link = `${baseUrl}?${params.toString()}`;
    setRequestLink(link);
    haptic.notification('success');
  };

  const copyRequestLink = async () => {
    try {
      await navigator.clipboard.writeText(requestLink);
      haptic.notification('success');
    } catch (error) {
      console.error('Failed to copy:', error);
      haptic.notification('error');
    }
  };

  const shareViaMessage = () => {
    const text = `💰 Payment Request\n\n${user?.first_name || 'Someone'} is requesting ${amount} ${currency}\n\n${message ? `Message: ${message}\n\n` : ''}Click to pay: ${requestLink}`;
    
    // Try to use Telegram's share functionality
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(requestLink)}&text=${encodeURIComponent(text)}`);
    } else {
      // Fallback to native share
      if (navigator.share) {
        navigator.share({
          title: 'Crypto Payment Request',
          text: text,
          url: requestLink,
        });
      } else {
        copyRequestLink();
      }
    }
    haptic.impact('medium');
  };

  const shareInGroup = () => {
    const text = `💰 Payment Request\n\n${user?.first_name || 'Someone'} is requesting ${amount} ${currency}\n\n${message ? `Message: ${message}\n\n` : ''}Click to pay: ${requestLink}`;
    
    // Open Telegram share dialog
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(requestLink)}&text=${encodeURIComponent(text)}`);
    }
    haptic.impact('medium');
  };

  const currencies = [
    { value: 'ETH', label: 'ETH', name: 'Ethereum' },
    { value: 'USDC', label: 'USDC', name: 'USD Coin' },
    { value: 'USDT', label: 'USDT', name: 'Tether USD' },
    { value: 'DAI', label: 'DAI', name: 'Dai Stablecoin' },
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Request Crypto
              </CardTitle>
              <CardDescription>
                Request payment from friends and family
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Amount and Currency */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.0001"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.value} value={curr.value}>
                      {curr.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="What's this payment for?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          {/* Generate Request */}
          <Button
            onClick={generateRequestLink}
            disabled={!amount || parseFloat(amount) <= 0}
            className="w-full"
          >
            Generate Payment Request
          </Button>

          {/* Request Link */}
          {requestLink && (
            <div className="space-y-3">
              <div className="bg-muted/50 rounded-lg p-3">
                <Label className="text-sm font-medium">Payment Request Link</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    value={requestLink}
                    readOnly
                    className="text-xs font-mono"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyRequestLink}
                    className="px-3"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Share Options */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={shareViaMessage}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
                <Button
                  onClick={shareInGroup}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Share className="h-4 w-4" />
                  Share in Group
                </Button>
              </div>
            </div>
          )}

          {/* Preview */}
          {amount && (
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2">Request Preview:</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Amount:</span> {amount} {currency}</p>
                <p><span className="font-medium">From:</span> {user?.first_name || 'You'}</p>
                <p><span className="font-medium">To:</span> {account?.slice(0, 6)}...{account?.slice(-4)}</p>
                {message && <p><span className="font-medium">Message:</span> {message}</p>}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
            <h4 className="font-medium text-sm mb-2">How it works:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Generate a payment request link</li>
              <li>• Share it with friends via Telegram</li>
              <li>• They can pay directly through the link</li>
              <li>• Receive notifications when paid</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestCrypto;

