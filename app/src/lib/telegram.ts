// Telegram Web App utility functions

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready(): void;
        expand(): void;
        close(): void;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          isProgressVisible: boolean;
          setText(text: string): void;
          onClick(fn: () => void): void;
          show(): void;
          hide(): void;
          enable(): void;
          disable(): void;
          showProgress(leaveActive?: boolean): void;
          hideProgress(): void;
        };
        BackButton: {
          isVisible: boolean;
          onClick(fn: () => void): void;
          show(): void;
          hide(): void;
        };
        HapticFeedback: {
          impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
          notificationOccurred(type: 'error' | 'success' | 'warning'): void;
          selectionChanged(): void;
        };
        initData: string;
        initDataUnsafe: {
          query_id?: string;
          user?: {
            id: number;
            is_bot?: boolean;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            is_premium?: boolean;
            added_to_attachment_menu?: boolean;
            allows_write_to_pm?: boolean;
            photo_url?: string;
          };
          receiver?: {
            id: number;
            type: 'user' | 'chat' | 'channel';
            title?: string;
            username?: string;
            photo_url?: string;
          };
          chat?: {
            id: number;
            type: 'group' | 'supergroup' | 'channel';
            title: string;
            username?: string;
            photo_url?: string;
          };
          chat_type?: 'sender' | 'private' | 'group' | 'supergroup' | 'channel';
          chat_instance?: string;
          start_param?: string;
          can_send_after?: number;
          auth_date: number;
          hash: string;
        };
        colorScheme: 'light' | 'dark';
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
          secondary_bg_color?: string;
        };
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        headerColor: string;
        backgroundColor: string;
        isClosingConfirmationEnabled: boolean;
        setHeaderColor(color: string): void;
        setBackgroundColor(color: string): void;
        enableClosingConfirmation(): void;
        disableClosingConfirmation(): void;
        onEvent(eventType: string, eventHandler: () => void): void;
        offEvent(eventType: string, eventHandler: () => void): void;
        sendData(data: string): void;
        switchInlineQuery(query: string, choose_chat_types?: string[]): void;
        openLink(url: string, options?: { try_instant_view?: boolean }): void;
        openTelegramLink(url: string): void;
        openInvoice(url: string, callback?: (status: string) => void): void;
        showPopup(params: {
          title?: string;
          message: string;
          buttons?: Array<{
            id?: string;
            type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
            text: string;
          }>;
        }, callback?: (buttonId: string) => void): void;
        showAlert(message: string, callback?: () => void): void;
        showConfirm(message: string, callback?: (confirmed: boolean) => void): void;
        showPrompt(message: string, callback?: (confirmed: boolean, value?: string) => void): void;
        showScanQrPopup(params: {
          text?: string;
        }, callback?: (data: string) => void): void;
        closeScanQrPopup(): void;
        readTextFromClipboard(callback?: (data: string) => void): void;
        requestWriteAccess(callback?: (access: boolean) => void): void;
        requestContact(callback?: (contact: boolean) => void): void;
        invokeCustomMethod(method: string, params?: any, callback?: (result: any) => void): void;
        isVersionAtLeast(version: string): boolean;
        platform: string;
        version: string;
        isSupported: boolean;
      };
    };
  }
}

export const initializeTelegramApp = () => {
  if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp;
    
    // Initialize the Web App
    tg.ready();
    
    // Expand the Web App to full height
    tg.expand();
    
    // Set up theme colors
    if (tg.themeParams) {
      document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#ffffff');
      document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#000000');
      document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color || '#999999');
      document.documentElement.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color || '#2481cc');
      document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color || '#2481cc');
      document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color || '#ffffff');
      document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', tg.themeParams.secondary_bg_color || '#f1f1f1');
    }
    
    return tg;
  }
  
  return null;
};

export const isTelegramApp = () => {
  return !!window.Telegram?.WebApp;
};

export const getTelegramUser = () => {
  return window.Telegram?.WebApp?.initDataUnsafe?.user;
};

export const showTelegramAlert = (message: string) => {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.showAlert(message);
  } else {
    alert(message);
  }
};

export const showTelegramConfirm = (message: string, callback: (confirmed: boolean) => void) => {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.showConfirm(message, callback);
  } else {
    const confirmed = confirm(message);
    callback(confirmed);
  }
};

export const setMainButton = (text: string, onClick: () => void) => {
  if (window.Telegram?.WebApp) {
    const mainButton = window.Telegram.WebApp.MainButton;
    mainButton.setText(text);
    mainButton.onClick(onClick);
    mainButton.show();
  }
};

export const hideMainButton = () => {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.MainButton.hide();
  }
};

export const showBackButton = (onClick: () => void) => {
  if (window.Telegram?.WebApp) {
    const backButton = window.Telegram.WebApp.BackButton;
    backButton.onClick(onClick);
    backButton.show();
  }
};

export const hideBackButton = () => {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.BackButton.hide();
  }
};

export const hapticFeedback = (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium') => {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.HapticFeedback.impactOccurred(style);
  }
}; 