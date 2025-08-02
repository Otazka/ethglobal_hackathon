import React, { useState, useRef } from 'react';
import { ArrowLeft, Download, Copy, QrCode, Share } from './lucide-react.jsx';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useMetaMask } from './useMetaMask';
import { useTelegram } from './useTelegram';

const ReceiveTransaction = ({ onBack }) => {
  const { account } = useMetaMask();
  const { haptic } = useTelegram();
  const [amount, setAmount] = useState('');
  const addressInputRef = useRef(null);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      haptic.notification('success');
      
      // Visual feedback
      if (addressInputRef.current) {
        addressInputRef.current.select();
      }
    } catch (error) {
      console.error('Failed to copy:', error);
      haptic.notification('error');
    }
  };

  const shareAddress = async () => {
    const shareData = {
      title: 'My Ethereum Address',
      text: `Send ETH to this address: ${account}`,
      url: `ethereum:${account}${amount ? `?value=${amount}` : ''}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        haptic.notification('success');
      } else {
        // Fallback to copying
        await copyToClipboard(account);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const generateQRCode = () => {
    const qrData = `ethereum:${account}${amount ? `?value=${amount}` : ''}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
    return qrUrl;
  };

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
                <Download className="h-5 w-5" />
                Receive ETH
              </CardTitle>
              <CardDescription>
                Share your address to receive Ethereum
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* QR Code */}
          <div className="text-center">
            <div className="inline-block p-4 bg-white rounded-lg border">
              <img
                src={generateQRCode()}
                alt="QR Code"
                className="w-48 h-48 mx-auto"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Scan QR code to send ETH to this address
            </p>
          </div>

          {/* Address Input */}
          <div className="space-y-2">
            <Label htmlFor="address">Your Ethereum Address</Label>
            <div className="flex gap-2">
              <Input
                id="address"
                ref={addressInputRef}
                value={account}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(account)}
                className="px-3"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Optional Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Request Amount (ETH) - Optional</Label>
            <Input
              id="amount"
              type="number"
              step="0.0001"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Specify an amount to request from the sender
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => copyToClipboard(account)}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button
              onClick={shareAddress}
              className="flex items-center gap-2"
            >
              <Share className="h-4 w-4" />
              Share
            </Button>
          </div>

          {/* Instructions */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-sm mb-2">How to receive ETH:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Share your address or QR code with the sender</li>
              <li>• Wait for the transaction to be confirmed</li>
              <li>• Your balance will update automatically</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReceiveTransaction;

