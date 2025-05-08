import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'tenant',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate('/auth/signin');
      }
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F0E6]">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#C45B39]">Create Account</h2>
          <p className="mt-2 text-[#2C5530]">Join Ulomu Direct Homes</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#2C5530]">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full border border-[#D4A64A] rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-[#C45B39] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2C5530]">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full border border-[#D4A64A] rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-[#C45B39] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2C5530]">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 block w-full border border-[#D4A64A] rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-[#C45B39] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2C5530]">Account Type</label>
            <select
              value={formData.userType}
              onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
              className="mt-1 block w-full border border-[#D4A64A] rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-[#C45B39] focus:border-transparent bg-white"
            >
              <option value="tenant">Tenant</option>
              <option value="landlord">Landlord</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-[#F5F0E6] bg-[#C45B39] hover:bg-[#2C5530] transition-colors duration-200"
          >
            Sign Up
          </button>
          <div className="text-center">
            <Link to="/auth/signin" className="text-[#C45B39] hover:text-[#2C5530] font-medium">
              Already have an account? Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}