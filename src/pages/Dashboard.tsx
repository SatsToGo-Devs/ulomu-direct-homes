
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UlomuDashboard from "@/components/Ulomu/Dashboard";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-gradient-to-r from-terracotta to-terracotta/90 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Ulomu Dashboard</h1>
          <p className="text-white/90">AI-powered property maintenance at your fingertips</p>
        </div>
      </div>
      <main className="flex-1 bg-beige/20">
        <UlomuDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
