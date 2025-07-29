#!/bin/bash

# Telegram Mini App Deployment Script
echo "🚀 Deploying Ether to TON Bridge as Telegram Mini App..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the app directory."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the app
echo "🔨 Building the app..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Deploy the 'dist' folder to your web server"
    echo "2. Ensure your domain has HTTPS enabled"
    echo "3. Create a Telegram bot via @BotFather"
    echo "4. Set the bot's menu button to your deployed URL"
    echo ""
    echo "🌐 Your app should be accessible at: https://your-domain.com"
    echo "🤖 Bot setup: Message @BotFather and use /setmenubutton"
    echo ""
    echo "📖 See telegram-mini-app-config.md for detailed instructions"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi 