import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Activity, Settings, Zap, Database, LogOut } from 'lucide-react';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, logout } = useAuth();

  if (loading) return <div className="min-h-screen bg-slate-50"></div>;
  
  if (user && !user.onboardingCompleted) {
    navigate('/onboarding', { replace: true });
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-2xl font-bold text-indigo-900 flex items-center gap-2">
            <Zap className="text-blue-500" /> RazorGrow AI
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/dashboard/actions" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition">
            <Activity size={20} /> AI Action Center
          </Link>
          <Link to="/dashboard/campaigns" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition">
            <Zap size={20} /> Campaigns
          </Link>
          <Link to="/dashboard/customers" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition">
            <Users size={20} /> Customers
          </Link>
          <Link to="/dashboard/products" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition">
            <Settings size={20} /> Products
          </Link>
          <Link to="/dashboard/transactions" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition">
            <Activity size={20} /> Payments
          </Link>
          <Link to="/dashboard/audit" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition">
            <Users size={20} /> Audit Log
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-200">
          <Link to="/dashboard/datasources" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition">
            <Database size={20} /> Data Sources
          </Link>
          <Link to="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition mt-1">
            <Settings size={20} /> Guardrails
          </Link>
          <button 
            onClick={() => { logout(); navigate('/login'); }} 
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition mt-1"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-8 justify-end">
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-slate-600">Test/Demo Mode</div>
            <div className="h-8 w-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold">
              DM
            </div>
          </div>
        </header>
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
