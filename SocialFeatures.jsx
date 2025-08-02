import React, { useState } from 'react';
import { ArrowLeft, Users, Send, Download, History, UserPlus } from './lucide-react.jsx';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useTelegram } from './useTelegram';
import RequestCrypto from './RequestCrypto';

const SocialFeatures = ({ onBack }) => {
  const { haptic, user } = useTelegram();
  const [activeTab, setActiveTab] = useState('main');

  // Mock data for demonstration
  const recentRequests = [
    {
      id: 1,
      from: 'Alice',
      amount: '0.1',
      currency: 'ETH',
      message: 'Coffee money',
      status: 'pending',
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      from: 'Bob',
      amount: '50',
      currency: 'USDC',
      message: 'Dinner split',
      status: 'paid',
      timestamp: '1 day ago',
    },
    {
      id: 3,
      from: 'Charlie',
      amount: '0.05',
      currency: 'ETH',
      message: 'Gas money',
      status: 'expired',
      timestamp: '3 days ago',
    },
  ];

  const friends = [
    {
      id: 1,
      name: 'Alice',
      username: '@alice',
      avatar: '👩‍💼',
      lastSeen: 'online',
    },
    {
      id: 2,
      name: 'Bob',
      username: '@bob',
      avatar: '👨‍💻',
      lastSeen: '2 hours ago',
    },
    {
      id: 3,
      name: 'Charlie',
      username: '@charlie',
      avatar: '👨‍🎨',
      lastSeen: '1 day ago',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleQuickSend = (friend) => {
    haptic.impact('light');
    // TODO: Implement quick send to friend
    console.log('Quick send to:', friend.name);
  };

  const handlePayRequest = (request) => {
    haptic.impact('medium');
    // TODO: Implement payment of request
    console.log('Pay request:', request);
  };

  if (activeTab === 'request') {
    return <RequestCrypto onBack={() => setActiveTab('main')} />;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Social Features
              </CardTitle>
              <CardDescription>
                Send and request crypto from friends
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => {
                haptic.impact('light');
                setActiveTab('request');
              }}
              className="h-16 flex flex-col gap-1"
            >
              <Download className="h-5 w-5" />
              <span className="text-sm">Request</span>
            </Button>
            <Button
              onClick={() => {
                haptic.impact('light');
                // TODO: Implement send to friends
              }}
              variant="outline"
              className="h-16 flex flex-col gap-1"
            >
              <Send className="h-5 w-5" />
              <span className="text-sm">Send</span>
            </Button>
          </div>

          {/* Recent Requests */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Recent Requests</h3>
              <Button variant="ghost" size="sm">
                <History className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {recentRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{request.from}</span>
                      <Badge variant="secondary" className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{request.message}</p>
                    <p className="text-xs text-muted-foreground">{request.timestamp}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">
                      {request.amount} {request.currency}
                    </p>
                    {request.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => handlePayRequest(request)}
                        className="mt-1 h-6 text-xs"
                      >
                        Pay
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Friends List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Friends</h3>
              <Button variant="ghost" size="sm">
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{friend.avatar}</div>
                    <div>
                      <p className="font-medium text-sm">{friend.name}</p>
                      <p className="text-xs text-muted-foreground">{friend.username}</p>
                      <p className="text-xs text-muted-foreground">{friend.lastSeen}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickSend(friend)}
                    className="h-8 text-xs"
                  >
                    Send
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-muted-foreground">Transactions</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold">5</p>
              <p className="text-xs text-muted-foreground">Friends</p>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
            <h4 className="font-medium text-sm mb-2">💡 Tips:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Request payments for shared expenses</li>
              <li>• Send crypto instantly to Telegram friends</li>
              <li>• Track payment history and status</li>
              <li>• Add friends by username or contact</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialFeatures;

