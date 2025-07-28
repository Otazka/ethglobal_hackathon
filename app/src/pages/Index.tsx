import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WalletConnector from "@/components/WalletConnector";
import WalletDashboard from "@/components/WalletDashboard";

const Index = () => {
  console.log("Index component rendering...");
  
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const handleWalletConnect = (address: string) => {
    console.log("Wallet connected:", address);
    setWalletAddress(address);
  };

  const handleDisconnect = () => {
    console.log("Wallet disconnected");
    setWalletAddress(null);
  };

  if (!walletAddress) {
    return <WalletConnector onWalletConnect={handleWalletConnect} />;
  }

  return (
    <WalletDashboard 
      walletAddress={walletAddress} 
      onDisconnect={handleDisconnect} 
    />
  );
};

export default Index;