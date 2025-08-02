import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, ArrowUpDown, AlertCircle, Loader2 } from './lucide-react.jsx';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useMetaMask } from './useMetaMask';
import { useTelegram } from './useTelegram';
import { use1inch } from './use1inch';
import { ethers } from 'ethers';

const SwapTokens = ({ onBack }) => {
  const { account, provider, signer } = useMetaMask();
  const { haptic } = useTelegram();
  const {
    isLoading: isSwapLoading,
    error: swapError,
    getSwapQuote,
    executeFusionSwap,
    getTokenBalance,
    COMMON_TOKENS,
  } = use1inch();

  const [fromToken, setFromToken] = useState(COMMON_TOKENS.ETH);
  const [toToken, setToToken] = useState(COMMON_TOKENS.USDC);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [quote, setQuote] = useState(null);
  const [isGettingQuote, setIsGettingQuote] = useState(false);
  const [balances, setBalances] = useState({});
  const [slippage, setSlippage] = useState(1);

  // Load token balances
  useEffect(() => {
    const loadBalances = async () => {
      if (!provider || !account) return;

      try {
        const newBalances = {};
        for (const [symbol, token] of Object.entries(COMMON_TOKENS)) {
          const balance = await getTokenBalance(provider, token.address, account);
          newBalances[symbol] = ethers.formatUnits(balance, token.decimals);
        }
        setBalances(newBalances);
      } catch (error) {
        console.error('Error loading balances:', error);
      }
    };

    loadBalances();
  }, [provider, account, getTokenBalance]);

  // Get quote when amount changes
  useEffect(() => {
    const getQuote = async () => {
      if (!fromAmount || parseFloat(fromAmount) <= 0) {
        setToAmount('');
        setQuote(null);
        return;
      }

      setIsGettingQuote(true);
      try {
        const amount = ethers.parseUnits(fromAmount, fromToken.decimals).toString();
        const quoteData = await getSwapQuote(fromToken.address, toToken.address, amount);
        
        const estimatedAmount = ethers.formatUnits(quoteData.toAmount, toToken.decimals);
        setToAmount(estimatedAmount);
        setQuote(quoteData);
      } catch (error) {
        console.error('Error getting quote:', error);
        setToAmount('');
        setQuote(null);
      } finally {
        setIsGettingQuote(false);
      }
    };

    const timeoutId = setTimeout(getQuote, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [fromAmount, fromToken, toToken, getSwapQuote]);

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount('');
    haptic.selection();
  };

  const handleMaxAmount = () => {
    const balance = balances[fromToken.symbol];
    if (balance) {
      // Reserve some for gas if it's ETH
      const maxAmount = fromToken.symbol === 'ETH' 
        ? Math.max(0, parseFloat(balance) - 0.01).toString()
        : balance;
      setFromAmount(maxAmount);
    }
    haptic.selection();
  };

  const handleSwap = async () => {
    if (!signer || !fromAmount || !quote) return;

    haptic.impact('medium');
    try {
      const amount = ethers.parseUnits(fromAmount, fromToken.decimals).toString();
      const tx = await executeFusionSwap(
        signer,
        fromToken.address,
        toToken.address,
        amount,
        slippage
      );

      haptic.notification('success');
      
      // Reset form
      setFromAmount('');
      setToAmount('');
      setQuote(null);
      
      // Reload balances
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('Swap failed:', error);
      haptic.notification('error');
    }
  };

  const canSwap = fromAmount && toAmount && quote && !isSwapLoading && !isGettingQuote;

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
                <RefreshCw className="h-5 w-5" />
                Swap Tokens
              </CardTitle>
              <CardDescription>
                Powered by 1inch Fusion+
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {swapError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{swapError}</AlertDescription>
            </Alert>
          )}

          {/* From Token */}
          <div className="space-y-2">
            <Label>From</Label>
            <div className="flex gap-2">
              <Select
                value={fromToken.symbol}
                onValueChange={(value) => setFromToken(COMMON_TOKENS[value])}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(COMMON_TOKENS).map(([symbol, token]) => (
                    <SelectItem key={symbol} value={symbol}>
                      {symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                step="0.0001"
                placeholder="0.0"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleMaxAmount}
                className="px-3"
              >
                Max
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Balance: {balances[fromToken.symbol] || '0'} {fromToken.symbol}
            </p>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSwapTokens}
              className="h-8 w-8 p-0 rounded-full"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          {/* To Token */}
          <div className="space-y-2">
            <Label>To</Label>
            <div className="flex gap-2">
              <Select
                value={toToken.symbol}
                onValueChange={(value) => setToToken(COMMON_TOKENS[value])}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(COMMON_TOKENS).map(([symbol, token]) => (
                    <SelectItem key={symbol} value={symbol}>
                      {symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="0.0"
                value={toAmount}
                readOnly
                className="flex-1 bg-muted"
              />
              {isGettingQuote && (
                <div className="flex items-center px-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Balance: {balances[toToken.symbol] || '0'} {toToken.symbol}
            </p>
          </div>

          {/* Slippage */}
          <div className="space-y-2">
            <Label>Slippage Tolerance (%)</Label>
            <Select value={slippage.toString()} onValueChange={(value) => setSlippage(parseFloat(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">0.5%</SelectItem>
                <SelectItem value="1">1%</SelectItem>
                <SelectItem value="2">2%</SelectItem>
                <SelectItem value="3">3%</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quote Info */}
          {quote && (
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Rate:</span>
                <span>
                  1 {fromToken.symbol} = {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)} {toToken.symbol}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Network Fee:</span>
                <span>~${quote.estimatedGas ? (parseFloat(quote.estimatedGas) * 0.00001).toFixed(2) : '0.00'}</span>
              </div>
            </div>
          )}

          {/* Swap Button */}
          <Button
            onClick={handleSwap}
            disabled={!canSwap}
            className="w-full"
          >
            {isSwapLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Swapping...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Swap Tokens
              </>
            )}
          </Button>

          <div className="text-xs text-muted-foreground text-center">
            <p>Powered by 1inch Fusion+ for optimal rates and MEV protection</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SwapTokens;

