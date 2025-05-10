
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Users, CreditCard, MessageSquare, FileText, Settings } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadMessageCount: number;
}

const Sidebar = ({ activeTab, setActiveTab, unreadMessageCount }: SidebarProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <nav className="space-y-2">
          <Button 
            variant={activeTab === "overview" ? "default" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("overview")}
          >
            <Home className="mr-2 h-5 w-5" />
            Overview
          </Button>
          <Button 
            variant={activeTab === "properties" ? "default" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("properties")}
          >
            <Home className="mr-2 h-5 w-5" />
            Properties
          </Button>
          <Button 
            variant={activeTab === "tenants" ? "default" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("tenants")}
          >
            <Users className="mr-2 h-5 w-5" />
            Tenants
          </Button>
          <Button 
            variant={activeTab === "payments" ? "default" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("payments")}
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Payments
          </Button>
          <Button 
            variant={activeTab === "messages" ? "default" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("messages")}
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Messages
            {unreadMessageCount > 0 && <Badge className="ml-auto bg-red-500">{unreadMessageCount}</Badge>}
          </Button>
          <Button 
            variant={activeTab === "invoices" ? "default" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("invoices")}
          >
            <FileText className="mr-2 h-5 w-5" />
            Invoices
          </Button>
          <Button 
            variant={activeTab === "settings" ? "default" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="mr-2 h-5 w-5" />
            Settings
          </Button>
        </nav>
      </CardContent>
    </Card>
  );
};

export default Sidebar;
