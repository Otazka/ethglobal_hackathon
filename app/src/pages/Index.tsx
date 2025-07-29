import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WalletConnector from "@/components/WalletConnector";
import WalletDashboard from "@/components/WalletDashboard";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  console.log("Index component rendering...");
  
  const { user, isAuthenticated, login, logout, loading } = useAuth();

  const handleWalletConnect = (address: string, signature?: string) => {
    console.log("Wallet connected:", address);
    login(address, signature);
  };

  const handleDisconnect = () => {
    console.log("Wallet disconnected");
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-card border border-border">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <WalletConnector onWalletConnect={handleWalletConnect} />;
  }

  return (
    <WalletDashboard 
      walletAddress={user!.address} 
      onDisconnect={handleDisconnect} 
    />
  );
};

export default Index;