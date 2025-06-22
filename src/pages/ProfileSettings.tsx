
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileSettings from "@/components/ProfileSettings";
import ProtectedRoute from "@/components/ProtectedRoute";

const ProfileSettingsPage = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="bg-gradient-to-r from-terracotta to-terracotta/90 text-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="text-white/90">Manage your personal information and preferences</p>
          </div>
        </div>
        <main className="flex-1 bg-beige/20">
          <ProfileSettings />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default ProfileSettingsPage;
