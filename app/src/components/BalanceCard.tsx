import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface BalanceCardProps {
  token: string;
  amount: number;
  usdValue: number;
  icon: string;
  network: string;
  change24h?: number;
}

const BalanceCard = ({ 
  token, 
  amount, 
  usdValue, 
  icon, 
  network, 
  change24h = 0 
}: BalanceCardProps) => {
  const isPositive = change24h >= 0;

  return (
    <Card className="p-4 bg-card border border-border hover:border-primary/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{icon}</div>
          <div>
            <div className="font-semibold">{token}</div>
            <Badge variant="secondary" className="text-xs">
              {network}
            </Badge>
          </div>
        </div>
        
        <div className="text-right">
          <div className="font-bold text-lg">
            {amount.toFixed(4)}
          </div>
          <div className="text-sm text-muted-foreground">
            ${usdValue.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="text-muted-foreground">24h Change</div>
        <div className={`flex items-center gap-1 ${
          isPositive ? 'text-success' : 'text-destructive'
        }`}>
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          {Math.abs(change24h).toFixed(2)}%
        </div>
      </div>
    </Card>
  );
};

export default BalanceCard;
