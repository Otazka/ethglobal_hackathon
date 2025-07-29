import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  Shield, 
  Eye, 
  EyeOff,
  Globe,
  Wallet,
  Bell,
  Palette,
  Lock,
  Key,
  Network,
  Zap,
  AlertTriangle,
  CheckCircle,
  Copy,
  Download,
  Upload,
  Trash2,
  RefreshCw
} from "lucide-react";

const SettingsInterface = () => {
  const [settings, setSettings] = useState({
    // Network Settings
    defaultNetwork: "ethereum",
    autoSwitchNetwork: true,
    gasOptimization: true,
    
    // Security Settings
    requireConfirmation: true,
    autoLockTimeout: 5,
    biometricAuth: false,
    twoFactorAuth: false,
    
    // Display Settings
    theme: "system",
    currency: "USD",
    language: "en",
    compactMode: false,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    transactionAlerts: true,
    priceAlerts: false,
    
    // Advanced Settings
    debugMode: false,
    autoBackup: true,
    dataCollection: false
  });

  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const networks = [
    { id: "ethereum", name: "Ethereum", icon: "🔷" },
    { id: "ton", name: "TON Network", icon: "💎" },
    { id: "auto", name: "Auto-detect", icon: "🌐" }
  ];

  const themes = [
    { id: "light", name: "Light" },
    { id: "dark", name: "Dark" },
    { id: "system", name: "System" }
  ];

  const currencies = [
    { id: "USD", name: "US Dollar", symbol: "$" },
    { id: "EUR", name: "Euro", symbol: "€" },
    { id: "GBP", name: "British Pound", symbol: "£" },
    { id: "JPY", name: "Japanese Yen", symbol: "¥" }
  ];

  const languages = [
    { id: "en", name: "English" },
    { id: "es", name: "Español" },
    { id: "fr", name: "Français" },
    { id: "de", name: "Deutsch" },
    { id: "zh", name: "中文" }
  ];

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const exportWallet = async () => {
    setIsExporting(true);
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const walletData = {
      address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
      networks: ["ethereum", "ton"],
      settings: settings,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(walletData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wallet-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    setIsExporting(false);
  };

  const resetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to default?")) {
      setSettings({
        defaultNetwork: "ethereum",
        autoSwitchNetwork: true,
        gasOptimization: true,
        requireConfirmation: true,
        autoLockTimeout: 5,
        biometricAuth: false,
        twoFactorAuth: false,
        theme: "system",
        currency: "USD",
        language: "en",
        compactMode: false,
        emailNotifications: true,
        pushNotifications: true,
        transactionAlerts: true,
        priceAlerts: false,
        debugMode: false,
        autoBackup: true,
        dataCollection: false
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Settings</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={resetSettings}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button variant="outline" onClick={exportWallet} disabled={isExporting}>
            {isExporting ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Network className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Network Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Default Network</label>
              <Select value={settings.defaultNetwork} onValueChange={(value) => updateSetting("defaultNetwork", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {networks.map((network) => (
                    <SelectItem key={network.id} value={network.id}>
                      <div className="flex items-center gap-2">
                        <span>{network.icon}</span>
                        <span>{network.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Auto-switch Networks</label>
                <p className="text-xs text-muted-foreground">Automatically switch to the best network for transactions</p>
              </div>
              <Switch 
                checked={settings.autoSwitchNetwork} 
                onCheckedChange={(checked) => updateSetting("autoSwitchNetwork", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Gas Optimization</label>
                <p className="text-xs text-muted-foreground">Automatically optimize gas fees for transactions</p>
              </div>
              <Switch 
                checked={settings.gasOptimization} 
                onCheckedChange={(checked) => updateSetting("gasOptimization", checked)}
              />
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Security</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Require Confirmation</label>
                <p className="text-xs text-muted-foreground">Always require confirmation for transactions</p>
              </div>
              <Switch 
                checked={settings.requireConfirmation} 
                onCheckedChange={(checked) => updateSetting("requireConfirmation", checked)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Auto-lock Timeout (minutes)</label>
              <Select value={settings.autoLockTimeout.toString()} onValueChange={(value) => updateSetting("autoLockTimeout", parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 minute</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Biometric Authentication</label>
                <p className="text-xs text-muted-foreground">Use fingerprint or face ID</p>
              </div>
              <Switch 
                checked={settings.biometricAuth} 
                onCheckedChange={(checked) => updateSetting("biometricAuth", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Two-Factor Authentication</label>
                <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Switch 
                checked={settings.twoFactorAuth} 
                onCheckedChange={(checked) => updateSetting("twoFactorAuth", checked)}
              />
            </div>
          </div>
        </Card>

        {/* Display Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Display</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Theme</label>
              <Select value={settings.theme} onValueChange={(value) => updateSetting("theme", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((theme) => (
                    <SelectItem key={theme.id} value={theme.id}>
                      {theme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Currency</label>
              <Select value={settings.currency} onValueChange={(value) => updateSetting("currency", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.id} value={currency.id}>
                      <div className="flex items-center gap-2">
                        <span>{currency.symbol}</span>
                        <span>{currency.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Language</label>
              <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language.id} value={language.id}>
                      {language.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Compact Mode</label>
                <p className="text-xs text-muted-foreground">Show more information in less space</p>
              </div>
              <Switch 
                checked={settings.compactMode} 
                onCheckedChange={(checked) => updateSetting("compactMode", checked)}
              />
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Email Notifications</label>
                <p className="text-xs text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch 
                checked={settings.emailNotifications} 
                onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Push Notifications</label>
                <p className="text-xs text-muted-foreground">Receive notifications on your device</p>
              </div>
              <Switch 
                checked={settings.pushNotifications} 
                onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Transaction Alerts</label>
                <p className="text-xs text-muted-foreground">Get notified about transaction status</p>
              </div>
              <Switch 
                checked={settings.transactionAlerts} 
                onCheckedChange={(checked) => updateSetting("transactionAlerts", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Price Alerts</label>
                <p className="text-xs text-muted-foreground">Get notified about price changes</p>
              </div>
              <Switch 
                checked={settings.priceAlerts} 
                onCheckedChange={(checked) => updateSetting("priceAlerts", checked)}
              />
            </div>
          </div>
        </Card>

        {/* Advanced Settings */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Advanced</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Debug Mode</label>
                <p className="text-xs text-muted-foreground">Show detailed logs and errors</p>
              </div>
              <Switch 
                checked={settings.debugMode} 
                onCheckedChange={(checked) => updateSetting("debugMode", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Auto Backup</label>
                <p className="text-xs text-muted-foreground">Automatically backup wallet data</p>
              </div>
              <Switch 
                checked={settings.autoBackup} 
                onCheckedChange={(checked) => updateSetting("autoBackup", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Data Collection</label>
                <p className="text-xs text-muted-foreground">Help improve the app with anonymous data</p>
              </div>
              <Switch 
                checked={settings.dataCollection} 
                onCheckedChange={(checked) => updateSetting("dataCollection", checked)}
              />
            </div>
          </div>

          <Separator className="my-4" />

          {/* Wallet Management */}
          <div className="space-y-4">
            <h4 className="font-medium">Wallet Management</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Button variant="outline" size="sm">
                <Copy className="w-4 h-4 mr-2" />
                Copy Address
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Private Key
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Data
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsInterface; 