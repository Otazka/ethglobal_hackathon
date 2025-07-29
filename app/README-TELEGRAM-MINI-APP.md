# Ether to TON Bridge - Telegram Mini App

This app has been configured to work as a Telegram Mini App, allowing users to bridge between Ethereum and TON blockchain directly within Telegram.

## 🚀 Quick Start

### 1. Build the App
```bash
cd app
npm install
npm run build
```

### 2. Deploy to Web Server
Deploy the `dist` folder to any web server with HTTPS support:
- **Vercel**: Drag and drop the `dist` folder
- **Netlify**: Connect your repository or upload the `dist` folder
- **GitHub Pages**: Push to a repository and enable Pages
- **Your own server**: Upload files to your web server

### 3. Create Telegram Bot
1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Send `/newbot`
3. Follow instructions to create your bot
4. Save the bot token

### 4. Configure Mini App
1. Message your bot
2. Send `/setmenubutton`
3. Set button text (e.g., "Open Bridge")
4. Set web app URL to your deployed app URL

## ✨ Features

### Telegram Integration
- ✅ Telegram Web App SDK
- ✅ Theme support (light/dark mode)
- ✅ Mobile-optimized interface
- ✅ Telegram theme colors
- ✅ Responsive viewport handling

### Bridge Features
- 🔄 Ethereum to TON bridging
- 💰 Balance checking
- 📊 Transaction history
- ⚙️ Settings management
- 🔐 Wallet connection

## 🛠️ Development

### Local Development
```bash
npm run dev
```
The app will work in browsers without Telegram features for development.

### Testing with Telegram
1. Use ngrok for local HTTPS testing:
   ```bash
   npx ngrok http 8080
   ```
2. Use the ngrok URL as your web app URL in BotFather
3. Test in Telegram

## 📱 Telegram Mini App Features

### Available APIs
```javascript
// Main button
window.Telegram.WebApp.MainButton.setText("Bridge Now");
window.Telegram.WebApp.MainButton.show();

// Back button
window.Telegram.WebApp.BackButton.show();

// Haptic feedback
window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');

// Alerts
window.Telegram.WebApp.showAlert("Transaction successful!");

// User data
const user = window.Telegram.WebApp.initDataUnsafe.user;
```

### Theme Colors
The app automatically uses Telegram's theme:
- Background: `var(--tg-theme-bg-color)`
- Text: `var(--tg-theme-text-color)`
- Buttons: `var(--tg-theme-button-color)`
- Links: `var(--tg-theme-link-color)`

## 🔧 Configuration

### Environment Variables
Create a `.env` file:
```env
VITE_TELEGRAM_BOT_TOKEN=your_bot_token
VITE_APP_URL=https://your-domain.com
```

### Customization
- Update colors in `src/index.css`
- Modify components in `src/components/`
- Add new features in `src/pages/`

## 📋 Deployment Checklist

- [ ] App builds successfully (`npm run build`)
- [ ] Deployed to HTTPS server
- [ ] Domain accessible and working
- [ ] Telegram bot created
- [ ] Menu button configured
- [ ] App tested in Telegram
- [ ] Mobile responsiveness verified
- [ ] Theme colors working

## 🐛 Troubleshooting

### Common Issues

**App not loading in Telegram:**
- Check HTTPS is enabled
- Verify domain is accessible
- Ensure web app URL is correct in BotFather

**Theme not working:**
- Check Telegram Web App SDK is loaded
- Verify theme parameters are set
- Test in different Telegram themes

**Build errors:**
- Run `npm install` to ensure dependencies
- Check Node.js version (16+ recommended)
- Clear node_modules and reinstall

### Development Tips
- Use browser dev tools to test Telegram features
- Check console for Web App SDK errors
- Test on both mobile and desktop Telegram
- Use ngrok for local HTTPS testing

## 📚 Resources

- [Telegram Mini Apps Documentation](https://core.telegram.org/bots/webapps)
- [Telegram Web App API](https://core.telegram.org/bots/webapps#webapp)
- [BotFather Commands](https://t.me/BotFather)

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the configuration guide
3. Test in different environments
4. Check Telegram's official documentation

---

**Note**: This app requires HTTPS to work as a Telegram Mini App. For local development, use ngrok or similar services to create HTTPS tunnels. 