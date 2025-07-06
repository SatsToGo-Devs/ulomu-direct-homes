
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Users, DollarSign, TrendingUp, Plus, Brain, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useProperties } from "@/hooks/useProperties";
import PropertyCard from "@/components/PropertyCard";
import ResponsiveDashboardCard from "@/components/Dashboard/ResponsiveDashboardCard";

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
    <div className="container-responsive space-y-6 sm:space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <ResponsiveDashboardCard
          title="Total Properties"
          icon={<Building className="h-4 w-4 text-white" />}
          value={loading ? "..." : stats.totalProperties}
          description={properties.length > 0 ? "Active portfolio" : "Start adding properties"}
          variant="terracotta"
        />

        <ResponsiveDashboardCard
          title="Active Tenants"
          icon={<Users className="h-4 w-4 text-white" />}
          value={loading ? "..." : stats.activeTenants}
          description="Occupied units"
          variant="forest"
        />

        <ResponsiveDashboardCard
          title="Monthly Revenue"
          icon={<DollarSign className="h-4 w-4 text-black" />}
          value={loading ? "..." : formatCurrency(stats.monthlyRevenue)}
          description="From all properties"
          variant="gold"
        />

        <ResponsiveDashboardCard
          title="AI Cost Savings"
          icon={<TrendingUp className="h-4 w-4 text-white" />}
          value={loading ? "..." : `${stats.costSavings}%`}
          description="Efficiency improvement"
          variant="forest"
        />
      </div>

      {/* Properties Section */}
      <Card className="bg-white border-ulomu-beige-dark">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl">Your Properties</CardTitle>
              <p className="text-sm text-muted-foreground">
                {properties.length} properties in your portfolio
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => navigate('/properties')}
                className="w-full sm:w-auto"
              >
                View All
              </Button>
              <Button
                onClick={() => navigate('/add-property')}
                className="bg-terracotta hover:bg-terracotta/90 w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {properties.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <Building className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-semibold mb-2">No Properties Yet</h3>
              <p className="text-gray-500 mb-4 text-sm sm:text-base px-4">Start building your property portfolio with AI-powered management</p>
              <Button 
                onClick={() => navigate('/add-property')}
                className="bg-terracotta hover:bg-terracotta/90 w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Property
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <Card className="bg-white border-ulomu-beige-dark hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Brain className="h-5 w-5 text-terracotta flex-shrink-0" />
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

        <Card className="bg-white border-ulomu-beige-dark hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Wrench className="h-5 w-5 text-forest flex-shrink-0" />
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

        <Card className="bg-white border-ulomu-beige-dark hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <DollarSign className="h-5 w-5 text-ulomu-gold flex-shrink-0" />
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
