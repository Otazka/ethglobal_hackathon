Cross-Chain Wallet with 1inch Fusion+
A modern cross-chain wallet application that enables seamless swaps between Ethereum and TON using 1inch Fusion+ technology.

🚀 Features
Cross-Chain Swaps: Swap between ETH ↔ TON using 1inch Fusion+
Real-Time Quotes: Get instant conversion rates and price impact
Wallet Integration: MetaMask support for secure transactions
Transaction History: Track all your cross-chain swaps
Modern UI: Beautiful gradient design with shadcn/ui components
Settings Panel: Customizable slippage tolerance
🛠️ Technology Stack
Frontend: React 18 + TypeScript + Vite
UI Components: shadcn/ui + Tailwind CSS
Cross-Chain: 1inch Fusion+ API
Wallet: MetaMask integration
State Management: React Query (TanStack Query)
📦 Installation
Clone the repository:
git clone <repository-url>
cd app
Install dependencies:
npm install
Set up environment variables:
cp .env.example .env.local
Add your 1inch API key to .env.local:

VITE_1INCH_API_KEY=your_1inch_api_key_here
Start the development server:
npm run dev
🔧 Configuration
1inch Fusion+ API
To use real 1inch Fusion+ API instead of mock data:

Get your API key from 1inch Portal
Add it to your .env.local file
Uncomment the actual API calls in src/lib/1inch.ts
Supported Tokens
Currently supported for cross-chain swaps:

ETH (Ethereum) ↔ TON (TON Network)
USDT (Both networks)
WETH (Ethereum)
🎯 Usage
Connecting Wallet
Click "Connect MetaMask" on the home screen
Approve the connection in MetaMask
Your wallet address will be displayed in the header
Making Cross-Chain Swaps
Select Tokens: Choose the token you want to swap from and to
Enter Amount: Input the amount you want to swap
Review Quote: Check the conversion rate, price impact, and estimated time
Adjust Settings: Modify slippage tolerance if needed
Execute Swap: Click "Swap" to execute the transaction
Transaction History
View all your past swaps in the History tab
Track transaction status (completed, pending, failed)
Click on transaction hashes to view on block explorers
🏗️ Project Structure
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── WalletConnector.tsx # MetaMask integration
│   ├── WalletDashboard.tsx # Main dashboard
│   ├── SwapInterface.tsx   # Cross-chain swap UI
│   ├── TransactionHistory.tsx # Transaction tracking
│   └── BalanceCard.tsx     # Token balance display
├── lib/
│   ├── 1inch.ts           # 1inch Fusion+ API service
│   └── utils.ts           # Utility functions
├── pages/
│   ├── Index.tsx          # Home page
│   └── NotFound.tsx       # 404 page
└── App.tsx               # Main app component
🔌 API Integration
1inch Fusion+ Service
The src/lib/1inch.ts file contains the service for 1inch Fusion+ integration:

// Get quote for cross-chain swap
const quote = await OneInchService.getQuote({
  fromToken: "ETH",
  toToken: "TON", 
  amount: "1.0",
  fromAddress: "0x...",
  slippage: 0.5
});

// Execute swap
const txHash = await OneInchService.executeSwap(params);
Supported Operations
Quote Generation: Get real-time conversion rates
Swap Execution: Execute cross-chain swaps
Token Discovery: Get supported tokens
Transaction Tracking: Monitor swap status
🎨 UI Components
The application uses a custom design system with:

Gradient Cards: Beautiful gradient backgrounds
Interactive Elements: Hover effects and animations
Status Indicators: Visual feedback for transaction states
Responsive Design: Works on desktop and mobile
🚀 Deployment
Build for Production
npm run build
Deploy to Vercel
Connect your repository to Vercel
Add environment variables in Vercel dashboard
Deploy automatically on push to main branch
Environment Variables
Required for production:

VITE_1INCH_API_KEY: Your 1inch Fusion+ API key
🔒 Security
Wallet Integration: Secure MetaMask connection
API Keys: Environment variables for sensitive data
Input Validation: Type-safe form handling
Error Handling: Graceful error management
🤝 Contributing
Fork the repository
Create a feature branch
Make your changes
Add tests if applicable
Submit a pull request
📄 License
This project is licensed under the MIT License.

🙏 Acknowledgments
1inch Fusion+ for cross-chain technology
shadcn/ui for beautiful components
MetaMask for wallet integration
Vite for fast development experience
