
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Users, DollarSign, TrendingUp, Plus, Brain, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useProperties } from "@/hooks/useProperties";
import PropertyCard from "@/components/PropertyCard";

const UlomuDashboard = () => {
  const navigate = useNavigate();
  const { stats, loading } = useDashboardData();
  const { properties, fetchProperties } = useProperties();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building className="h-4 w-4 text-terracotta" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.totalProperties}</div>
            <p className="text-xs text-muted-foreground">
              {properties.length > 0 ? "Active portfolio" : "Start adding properties"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
            <Users className="h-4 w-4 text-forest" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.activeTenants}</div>
            <p className="text-xs text-muted-foreground">
              Occupied units
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : formatCurrency(stats.monthlyRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              From all properties
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Cost Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.costSavings}%</div>
            <p className="text-xs text-muted-foreground">
              Efficiency improvement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Properties Section */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Your Properties</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {properties.length} properties in your portfolio
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate('/properties')}
                >
                  View All
                </Button>
                <Button
                  onClick={() => navigate('/add-property')}
                  className="bg-terracotta hover:bg-terracotta/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {properties.length === 0 ? (
              <div className="text-center py-8">
                <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Properties Yet</h3>
                <p className="text-gray-500 mb-4">Start building your property portfolio with AI-powered management</p>
                <Button 
                  onClick={() => navigate('/add-property')}
                  className="bg-terracotta hover:bg-terracotta/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Property
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.slice(0, 3).map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onView={(prop) => navigate(`/property/${prop.id}`)}
                    onPropertyUpdated={fetchProperties}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-terracotta" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Get AI-powered insights for your properties
            </p>
            <Button 
              onClick={() => navigate('/ai-insights')}
              className="w-full"
              variant="outline"
            >
              View AI Insights
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-forest" />
              Maintenance Hub
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Manage maintenance requests and schedules
            </p>
            <Button 
              onClick={() => navigate('/maintenance')}
              className="w-full"
              variant="outline"
            >
              Open Maintenance Hub
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gold" />
              Escrow Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Secure payments and service charges
            </p>
            <Button 
              onClick={() => navigate('/escrow')}
              className="w-full"
              variant="outline"
            >
              Manage Escrow
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UlomuDashboard;
