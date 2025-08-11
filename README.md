# Cross-Chain Wallet with 1inch Fusion+

A modern cross-chain wallet application that enables seamless swaps between Ethereum and TON using 1inch Fusion+ technology.

> 🌟 **Featured on ETHGlobal**: This project was showcased at ETHGlobal Unite Defi. [View the showcase →](https://ethglobal.com/showcase/tonethbot-2bcv7)

## 🚀 Features

- **Cross-Chain Swaps**: Swap between ETH ↔ TON using 1inch Fusion+
- **Real-Time Quotes**: Get instant conversion rates and price impact
- **Wallet Integration**: MetaMask support for secure transactions
- **Transaction History**: Track all your cross-chain swaps
- **Modern UI**: Beautiful gradient design with shadcn/ui components
- **Settings Panel**: Customizable slippage tolerance

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **Cross-Chain**: 1inch Fusion+ API
- **Wallet**: MetaMask integration
- **State Management**: React Query (TanStack Query)

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```

4. **Add your 1inch API key to `.env.local`**:
   ```env
   VITE_1INCH_API_KEY=your_1inch_api_key_here
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### 1inch Fusion+ API

To use real 1inch Fusion+ API instead of mock data:

1. Get your API key from [1inch Portal](https://portal.1inch.dev/)
2. Add it to your `.env.local` file
3. Uncomment the actual API calls in `src/lib/1inch.ts`

### Supported Tokens

Currently supported for cross-chain swaps:

- **ETH** (Ethereum) ↔ **TON** (TON Network)
- **USDT** (Both networks)
- **WETH** (Ethereum)

## 🎯 Usage

### Connecting Wallet

1. Click "Connect MetaMask" on the home screen
2. Approve the connection in MetaMask
3. Your wallet address will be displayed in the header

### Making Cross-Chain Swaps

1. **Select Tokens**: Choose the token you want to swap from and to
2. **Enter Amount**: Input the amount you want to swap
3. **Review Quote**: Check the conversion rate, price impact, and estimated time
4. **Adjust Settings**: Modify slippage tolerance if needed
5. **Execute Swap**: Click "Swap" to execute the transaction

### Transaction History

- View all your past swaps in the History tab
- Track transaction status (completed, pending, failed)
- Click on transaction hashes to view on block explorers

## 🏗️ Project Structure

```
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
```

## 🔌 API Integration

### 1inch Fusion+ Service

The `src/lib/1inch.ts` file contains the service for 1inch Fusion+ integration:

```typescript
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
```

### Supported Operations

- **Quote Generation**: Get real-time conversion rates
- **Swap Execution**: Execute cross-chain swaps
- **Token Discovery**: Get supported tokens
- **Transaction Tracking**: Monitor swap status

## 🎨 UI Components

The application uses a custom design system with:

- **Gradient Cards**: Beautiful gradient backgrounds
- **Interactive Elements**: Hover effects and animations
- **Status Indicators**: Visual feedback for transaction states
- **Responsive Design**: Works on desktop and mobile

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables

Required for production:

```env
VITE_1INCH_API_KEY=your_1inch_fusion_api_key
```

## 🔒 Security

- **Wallet Integration**: Secure MetaMask connection
- **API Keys**: Environment variables for sensitive data
- **Input Validation**: Type-safe form handling
- **Error Handling**: Graceful error management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [1inch Fusion+](https://1inch.io/) for cross-chain technology
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [MetaMask](https://metamask.io/) for wallet integration
- [Vite](https://vitejs.dev/) for fast development experience
