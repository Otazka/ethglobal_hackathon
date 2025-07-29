# Telegram Mini App Setup Guide

## Overview
This guide explains how to deploy your Ether to TON Bridge app as a Telegram Mini App.

## Prerequisites
1. A Telegram Bot (create via @BotFather)
2. A web server to host your app
3. HTTPS domain (required for Telegram Mini Apps)

## Steps to Deploy

### 1. Create a Telegram Bot
1. Message @BotFather on Telegram
2. Send `/newbot`
3. Follow the instructions to create your bot
4. Save the bot token

### 2. Configure Your Bot for Mini App
1. Message @BotFather with your bot
2. Send `/setmenubutton`
3. Choose your bot
4. Set the button text (e.g., "Open Bridge")
5. Set the web app URL to your deployed app URL

### 3. Deploy Your App
1. Build your app:
   ```bash
   npm run build
   ```

2. Deploy to a web server with HTTPS (e.g., Vercel, Netlify, or your own server)

3. Your app URL should be accessible via HTTPS

### 4. Update Bot Commands (Optional)
Message @BotFather with your bot and send:
```
/setcommands
```
Then add commands like:
```
bridge - Open the Ether to TON Bridge
help - Get help with the bridge
```

## Telegram Web App Features

Your app now includes:
- ✅ Telegram Web App SDK integration
- ✅ Theme support (light/dark mode)
- ✅ Responsive viewport handling
- ✅ Telegram theme colors
- ✅ Mobile-optimized interface

## Testing Your Mini App

1. **In Telegram**: Open your bot and click the menu button
2. **Development**: Open your app in a browser - it will work without Telegram features
3. **Local Testing**: Use ngrok or similar to test with HTTPS locally

## Customization

### Theme Colors
The app automatically uses Telegram's theme colors:
- Background: `var(--tg-theme-bg-color)`
- Text: `var(--tg-theme-text-color)`
- Buttons: `var(--tg-theme-button-color)`
- Links: `var(--tg-theme-link-color)`

### Telegram Features Available
- `window.Telegram.WebApp.MainButton` - Main action button
- `window.Telegram.WebApp.BackButton` - Back navigation
- `window.Telegram.WebApp.HapticFeedback` - Haptic feedback
- `window.Telegram.WebApp.showAlert()` - Show alerts
- `window.Telegram.WebApp.showConfirm()` - Show confirmations
- `window.Telegram.WebApp.openLink()` - Open external links

## Security Considerations

1. **HTTPS Required**: Mini Apps must be served over HTTPS
2. **Domain Validation**: Telegram validates your domain
3. **User Data**: Access user data via `window.Telegram.WebApp.initDataUnsafe.user`
4. **Authentication**: Use Telegram's built-in authentication

## Deployment Checklist

- [ ] App built with `npm run build`
- [ ] Deployed to HTTPS server
- [ ] Bot created and configured
- [ ] Menu button set with correct URL
- [ ] App tested in Telegram
- [ ] Theme colors working correctly
- [ ] Mobile responsiveness verified

## Troubleshooting

### Common Issues:
1. **App not loading**: Check HTTPS and domain configuration
2. **Theme not working**: Verify Telegram Web App SDK is loaded
3. **Bot not responding**: Check bot token and permissions
4. **Menu button not showing**: Ensure web app URL is set correctly

### Development Tips:
- Use browser dev tools to test Telegram features
- Check console for Web App SDK errors
- Test on both mobile and desktop Telegram clients 