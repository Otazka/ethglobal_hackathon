import { useState } from "react";
import WalletConnector from "@/components/WalletConnector";
import WalletDashboard from "@/components/WalletDashboard";

const Index = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
  };

  const handleDisconnect = () => {
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