import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, TrendingUp, Users, ShoppingBag } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold">R</div>
              <span className="text-xl font-bold text-slate-900">RazorGrow AI</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium">Log in</Link>
              <Link to="/signup" className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-8">
            Turn payment data into <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">intelligent growth.</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto">
            An AI growth agent that analyzes payments, customers and products to identify revenue opportunities and help merchants act on them safely.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/signup" className="px-8 py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 transition flex items-center gap-2">
              <Zap size={20} /> Get Started Free
            </Link>
            <Link to="/login" className="px-8 py-4 rounded-xl bg-white border-2 border-slate-200 text-slate-800 font-bold text-lg hover:border-slate-300 transition">
              Login to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">How RazorGrow AI Works</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Customer Intelligence</h3>
              <p className="text-slate-600">Identify high-value cohorts, detect churn risks, and automate personalized recovery workflows based on LTV.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <ShoppingBag size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Product Intelligence</h3>
              <p className="text-slate-600">Discover which products are frequently bought together and generate instant cross-sell campaigns.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Merchant Guardrails</h3>
              <p className="text-slate-600">Set strict financial limits on AI actions. Every campaign requires human-in-the-loop approval before executing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
