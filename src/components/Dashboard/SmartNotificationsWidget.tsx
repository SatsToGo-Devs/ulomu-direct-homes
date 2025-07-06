
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSmartNotifications } from '@/hooks/useSmartNotifications';
import { 
  Bell, 
  CheckCheck, 
  AlertTriangle, 
  Info, 
  Wrench,
  DollarSign,
  Users,
  Settings
} from 'lucide-react';

const SmartNotificationsWidget: React.FC = () => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useSmartNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'maintenance': return <Wrench className="h-4 w-4" />;
      case 'escrow': return <DollarSign className="h-4 w-4" />;
      case 'vendor': return <Users className="h-4 w-4" />;
      case 'ai_insight': return <AlertTriangle className="h-4 w-4" />;
      case 'system': return <Settings className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Smart Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terracotta"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2">
          <div className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          Notifications
        </CardTitle>
        {unreadCount > 0 && (
          <Button 
            onClick={markAllAsRead}
            size="sm" 
            variant="outline"
            className="flex items-center gap-1"
          >
            <CheckCheck className="h-3 w-3" />
            Mark All Read
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {notifications.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          notifications.slice(0, 5).map((notification) => (
            <div 
              key={notification.id} 
              className={`border rounded-lg p-3 space-y-2 cursor-pointer transition-colors ${
                !notification.read 
                  ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-1">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{notification.title}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                      {notification.message}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                  <Badge className={getPriorityColor(notification.priority)}>
                    {notification.priority}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{new Date(notification.created_at).toLocaleDateString()}</span>
                <span className="capitalize">{notification.type.replace('_', ' ')}</span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default SmartNotificationsWidget;
