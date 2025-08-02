import React, { useState } from 'react';
import { ArrowLeft, Send, AlertCircle, Loader2 } from './lucide-react.jsx';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { useMetaMask } from './useMetaMask';
import { useTelegram } from './useTelegram';
import { ethers } from 'ethers';

const SendTransaction = ({ onBack }) => {
  const { balance, sendTransaction } = useMetaMask();
  const { haptic } = useTelegram();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateInputs = () => {
    if (!recipient) {
      return 'Recipient address is required';
    }

    if (!ethers.isAddress(recipient)) {
      return 'Invalid recipient address';
    }

    if (!amount || parseFloat(amount) <= 0) {
      return 'Amount must be greater than 0';
    }

    if (parseFloat(amount) > parseFloat(balance)) {
      return 'Insufficient balance';
    }

    return null;
  };

  const handleSend = async () => {
    setError('');
    setSuccess('');

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      haptic.notification('error');
      return;
    }

    setIsLoading(true);
    haptic.impact('medium');

    try {
      const tx = await sendTransaction(recipient, amount);
      setSuccess(`Transaction sent! Hash: ${tx.hash}`);
      haptic.notification('success');
      
      // Clear form
      setRecipient('');
      setAmount('');
    } catch (error) {
      console.error('Transaction failed:', error);
      setError(error.message || 'Transaction failed');
      haptic.notification('error');
    } finally {
      setIsLoading(false);
    }
  };

  const setMaxAmount = () => {
    // Reserve some ETH for gas fees
    const maxAmount = Math.max(0, parseFloat(balance) - 0.001);
    setAmount(maxAmount.toString());
    haptic.selection();
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
                <Send className="h-5 w-5" />
                Send ETH
              </CardTitle>
              <CardDescription>
                Send Ethereum to another address
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="amount">Amount (ETH)</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={setMaxAmount}
                disabled={isLoading}
                className="h-6 text-xs"
              >
                Max
              </Button>
            </div>
            <Input
              id="amount"
              type="number"
              step="0.0001"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Available: {parseFloat(balance).toFixed(4)} ETH
            </p>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleSend}
              disabled={isLoading || !recipient || !amount}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Transaction
                </>
              )}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            <p>Network fees will be deducted from your balance</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SendTransaction;

