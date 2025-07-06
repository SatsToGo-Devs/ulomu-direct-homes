
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Users, DollarSign, TrendingUp, Plus, Brain, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useProperties } from "@/hooks/useProperties";
import PropertyCard from "@/components/PropertyCard";
import EnhancedDashboardMetrics from "@/components/Dashboard/EnhancedDashboardMetrics";
import AnimatedCard from "@/components/Dashboard/AnimatedCard";

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
      {/* Enhanced Welcome Section */}
      <AnimatedCard className="bg-gradient-to-r from-terracotta to-terracotta/90 text-white border-none shadow-lg">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 animate-fade-in">
                Welcome to Ulomu
              </h1>
              <p className="text-white/90 text-sm sm:text-base lg:text-lg animate-fade-in animate-stagger-1">
                AI-powered property management made simple
              </p>
            </div>
            <div className="animate-scale-in animate-stagger-2">
              <Building className="h-12 w-12 sm:h-16 sm:w-16 text-white/20" />
            </div>
          </div>
        </CardContent>
      </AnimatedCard>

      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <EnhancedDashboardMetrics
          title="Total Properties"
          icon={<Building className="h-4 w-4 text-white" />}
          value={loading ? "..." : stats.totalProperties}
          variant="terracotta"
          loading={loading}
          change={properties.length > 0 ? { value: 15, label: "growth this month" } : undefined}
        />

        <EnhancedDashboardMetrics
          title="Active Tenants"
          icon={<Users className="h-4 w-4 text-white" />}
          value={loading ? "..." : stats.activeTenants}
          variant="forest"
          loading={loading}
        />

        <EnhancedDashboardMetrics
          title="Monthly Revenue"
          icon={<DollarSign className="h-4 w-4 text-black" />}
          value={loading ? "..." : formatCurrency(stats.monthlyRevenue)}
          variant="gold"
          loading={loading}
          change={{ value: 8.2, label: "vs last month" }}
        />

        <EnhancedDashboardMetrics
          title="AI Cost Savings"
          icon={<TrendingUp className="h-4 w-4 text-white" />}
          value={loading ? "..." : `${stats.costSavings}%`}
          variant="forest"
          loading={loading}
          change={{ value: 23, label: "efficiency gain" }}
        />
      </div>

      {/* Enhanced Properties Section */}
      <AnimatedCard className="bg-white border-ulomu-beige-dark shadow-sm" delay={200}>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl animate-fade-in">Your Properties</CardTitle>
              <p className="text-sm text-muted-foreground animate-fade-in animate-stagger-1">
                {properties.length} properties in your portfolio
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => navigate('/properties')}
                className="w-full sm:w-auto transition-all duration-200 hover:scale-105"
              >
                View All
              </Button>
              <Button
                onClick={() => navigate('/add-property')}
                className="bg-terracotta hover:bg-terracotta/90 w-full sm:w-auto transition-all duration-200 hover:scale-105"
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
              <Building className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4 animate-float" />
              <h3 className="text-base sm:text-lg font-semibold mb-2">No Properties Yet</h3>
              <p className="text-gray-500 mb-4 text-sm sm:text-base px-4">Start building your property portfolio with AI-powered management</p>
              <Button 
                onClick={() => navigate('/add-property')}
                className="bg-terracotta hover:bg-terracotta/90 w-full sm:w-auto transition-all duration-200 hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Property
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {properties.slice(0, 3).map((property, index) => (
                <div 
                  key={property.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <PropertyCard
                    property={property}
                    onView={(prop) => navigate(`/property/${prop.id}`)}
                    onPropertyUpdated={fetchProperties}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </AnimatedCard>

      {/* Enhanced Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <AnimatedCard className="bg-white border-ulomu-beige-dark hover:shadow-lg transition-all duration-300 group" delay={300}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Brain className="h-5 w-5 text-terracotta flex-shrink-0 group-hover:animate-pulse" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Get AI-powered insights for your properties
            </p>
            <Button 
              onClick={() => navigate('/ai-insights')}
              className="w-full transition-all duration-200 hover:scale-105"
              variant="outline"
            >
              View AI Insights
            </Button>
          </CardContent>
        </AnimatedCard>

        <AnimatedCard className="bg-white border-ulomu-beige-dark hover:shadow-lg transition-all duration-300 group" delay={400}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Wrench className="h-5 w-5 text-forest flex-shrink-0 group-hover:rotate-12 transition-transform duration-200" />
              Maintenance Hub
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Manage maintenance requests and schedules
            </p>
            <Button 
              onClick={() => navigate('/maintenance')}
              className="w-full transition-all duration-200 hover:scale-105"
              variant="outline"
            >
              Open Maintenance Hub
            </Button>
          </CardContent>
        </AnimatedCard>

        <AnimatedCard className="bg-white border-ulomu-beige-dark hover:shadow-lg transition-all duration-300 group" delay={500}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <DollarSign className="h-5 w-5 text-ulomu-gold flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
              Escrow Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Secure payments and service charges
            </p>
            <Button 
              onClick={() => navigate('/escrow')}
              className="w-full transition-all duration-200 hover:scale-105"
              variant="outline"
            >
              Manage Escrow
            </Button>
          </CardContent>
        </AnimatedCard>
      </div>
    </div>
  );
};

export default UlomuDashboard;
