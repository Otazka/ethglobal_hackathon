import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { initializeTelegramApp } from "./lib/telegram";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import React from "react";
import { WagmiConfig } from 'wagmi';
import { wagmiConfig } from '@/lib/wagmi';

const queryClient = new QueryClient();

const App = () => {
  console.log('🚀 App component rendering...');
  
  React.useEffect(() => {
    try {
      console.log('📱 Initializing Telegram app...');
      initializeTelegramApp();
      console.log('✅ Telegram app initialized successfully');
    } catch (error) {
      console.error('❌ Telegram initialization error:', error);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <AuthProvider>
          <TooltipProvider>
            <div 
              className="min-h-screen"
              style={{ 
                backgroundColor: 'var(--tg-theme-bg-color, #1a1a1a)',
                color: 'var(--tg-theme-text-color, #ffffff)'
              }}
            >
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </div>
          </TooltipProvider>
        </AuthProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
};

export default App;