import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connectRazorpay, connectDemo, uploadCsv, setupStore } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Upload, Database, Loader2, Store } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  
  // Steps: 'setup' | 'dataSource' | 'csv'
  const [step, setStep] = useState(user?.onboardingCompleted ? 'dataSource' : 'setup');
  const [loading, setLoading] = useState<'razorpay' | 'demo' | 'csv' | 'setup' | null>(null);
  
  // Setup form state
  const [businessName, setBusinessName] = useState(user?.businessName || '');
  const [businessCategory, setBusinessCategory] = useState('');
  const [growthGoal, setGrowthGoal] = useState('');
  
  // CSV form state
  const [file, setFile] = useState<File | null>(null);

  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('setup');
    try {
      await setupStore({ businessName, businessCategory, growthGoal });
      await refreshUser(); // Fetch updated user with onboardingCompleted = true
      setStep('dataSource');
    } catch (e) {
      alert('Failed to save business details');
    } finally {
      setLoading(null);
    }
  };

  const handleRazorpay = async () => {
    setLoading('razorpay');
    try {
      await connectRazorpay();
      await refreshUser();
      navigate('/dashboard');
    } catch (e) {
      alert('Failed to connect Razorpay');
    } finally {
      setLoading(null);
    }
  };

  const handleDemo = async () => {
    setLoading('demo');
    try {
      await connectDemo();
      await refreshUser();
      navigate('/dashboard');
    } catch (e) {
      alert('Failed to connect Demo Store');
    } finally {
      setLoading(null);
    }
  };

  const handleCsvUpload = async () => {
    if (!file) return;
    setLoading('csv');
    try {
      await uploadCsv(file);
      await refreshUser();
      navigate('/dashboard');
    } catch (e) {
      alert('Failed to upload CSV');
    } finally {
      setLoading(null);
    }
  };

  if (step === 'setup') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <Store className="text-indigo-600" size={28} />
            <h2 className="text-2xl font-bold text-slate-800">Set Up Your Store</h2>
          </div>
          <p className="text-slate-600 mb-8">Connect your business data to unlock personalized AI growth insights.</p>
          
          <form onSubmit={handleSetupSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
              <input 
                type="text" 
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="e.g. Acme Corp"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Business Category</label>
              <select 
                required
                value={businessCategory}
                onChange={(e) => setBusinessCategory(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
              >
                <option value="" disabled>Select a category</option>
                <option value="E-commerce">E-commerce</option>
                <option value="SaaS">SaaS</option>
                <option value="Retail">Retail</option>
                <option value="Education">Education</option>
                <option value="Services">Services</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Primary Growth Goal</label>
              <select 
                required
                value={growthGoal}
                onChange={(e) => setGrowthGoal(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
              >
                <option value="" disabled>Select your main goal</option>
                <option value="Increase Revenue">Increase Revenue</option>
                <option value="Recover Failed Payments">Recover Failed Payments</option>
                <option value="Improve Conversion">Improve Conversion</option>
                <option value="Retain Customers">Retain Customers</option>
                <option value="Increase Average Order Value">Increase Average Order Value</option>
              </select>
            </div>

            <button 
              type="submit"
              disabled={loading === 'setup'}
              className="w-full py-3 text-white font-bold bg-indigo-600 rounded-xl hover:bg-indigo-700 transition flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
            >
              {loading === 'setup' ? <Loader2 className="animate-spin" size={20}/> : 'Continue to Data Source'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 'csv') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Upload Transaction Data</h2>
          <p className="text-slate-600 mb-6">Upload your transaction CSV and let RazorGrow AI analyze your business.</p>
          
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center mb-6 hover:bg-slate-50 transition cursor-pointer relative">
            <input 
              type="file" 
              accept=".csv" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <Upload className="mx-auto text-indigo-500 mb-4" size={40} />
            {file ? (
              <p className="text-slate-800 font-bold">{file.name}</p>
            ) : (
              <>
                <p className="text-slate-700 font-medium">Click or drag CSV file here</p>
                <p className="text-sm text-slate-500 mt-1">Template must include customer_id, amount, status</p>
              </>
            )}
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setStep('dataSource')}
              className="flex-1 py-3 text-slate-700 font-bold bg-slate-100 rounded-xl hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button 
              onClick={handleCsvUpload}
              disabled={!file || loading === 'csv'}
              className="flex-1 py-3 text-white font-bold bg-indigo-600 rounded-xl hover:bg-indigo-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading === 'csv' ? <Loader2 className="animate-spin" size={20}/> : 'Import & Analyze'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // step === 'dataSource'
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-10 max-w-2xl">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Choose your data source</h1>
        <p className="text-xl text-slate-600">Give your AI growth agent access to your payment and transaction data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        {/* Card 1 */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full hover:shadow-md transition">
          <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-3">Connect Razorpay</h2>
          <p className="text-slate-600 mb-8 flex-1">Connect your Razorpay account to analyze payment activity securely.</p>
          <button 
            onClick={handleRazorpay}
            disabled={!!loading}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading === 'razorpay' ? <Loader2 className="animate-spin" size={20}/> : 'Connect Razorpay'}
          </button>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full hover:shadow-md transition">
          <div className="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
            <Upload size={28} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-3">Upload Transaction CSV</h2>
          <p className="text-slate-600 mb-8 flex-1">Upload your transaction data and let RazorGrow analyze your business.</p>
          <button 
            onClick={() => setStep('csv')}
            disabled={!!loading}
            className="w-full py-3 bg-slate-100 text-slate-800 font-bold rounded-xl hover:bg-slate-200 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            Upload CSV
          </button>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full hover:shadow-md transition">
          <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
            <Database size={28} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-3">Use Demo Store</h2>
          <p className="text-slate-600 mb-8 flex-1">Explore RazorGrow AI using realistic sample merchant data instantly.</p>
          <button 
            onClick={handleDemo}
            disabled={!!loading}
            className="w-full py-3 border-2 border-emerald-600 text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading === 'demo' ? <Loader2 className="animate-spin" size={20}/> : 'Use Demo Store'}
          </button>
        </div>
      </div>
    </div>
  );
}
