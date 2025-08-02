import { useState, useEffect } from 'react';

export const useTelegram = () => {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const initTelegram = async () => {
      try {
        // Initialize Telegram Web App
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp;
          
          // Expand the app to full height
          tg.expand();
          
          // Enable closing confirmation
          tg.enableClosingConfirmation();
          
          // Set header color
          tg.setHeaderColor('#6366f1');
          
          // Get user data
          if (tg.initDataUnsafe?.user) {
            setUser(tg.initDataUnsafe.user);
          }
          
          // Set theme
          setTheme(tg.colorScheme || 'light');
          
          // Listen for theme changes
          tg.onEvent('themeChanged', () => {
            setTheme(tg.colorScheme || 'light');
          });
          
          setIsReady(true);
        } else {
          // Fallback for development/testing
          console.log('Telegram WebApp not available, using fallback');
          setUser({
            id: 123456789,
            first_name: 'Test',
            last_name: 'User',
            username: 'testuser',
          });
          setIsReady(true);
        }
      } catch (error) {
        console.error('Error initializing Telegram:', error);
        setIsReady(true); // Still set ready to allow app to function
      }
    };

    initTelegram();
  }, []);

  // Show main button
  const showMainButton = (text, onClick) => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.MainButton.text = text;
      tg.MainButton.show();
      tg.MainButton.onClick(onClick);
    }
  };

  // Hide main button
  const hideMainButton = () => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.MainButton.hide();
    }
  };

  // Show back button
  const showBackButton = (onClick) => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.BackButton.show();
      tg.BackButton.onClick(onClick);
    }
  };

  // Hide back button
  const hideBackButton = () => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.BackButton.hide();
    }
  };

  // Haptic feedback
  const haptic = {
    impact: (style = 'medium') => {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred(style);
      }
    },
    notification: (type = 'success') => {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred(type);
      }
    },
    selection: () => {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        window.Telegram.WebApp.HapticFeedback.selectionChanged();
      }
    },
  };

  // Close app
  const close = () => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.close();
    }
  };

  // Send data to bot
  const sendData = (data) => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.sendData(JSON.stringify(data));
    }
  };

  // Open link
  const openLink = (url) => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink(url);
    }
  };

  // Open telegram link
  const openTelegramLink = (url) => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(url);
    }
  };

  return {
    isReady,
    user,
    theme,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    haptic,
    close,
    sendData,
    openLink,
    openTelegramLink,
  };
};

