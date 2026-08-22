import { useState, useEffect } from 'react';
import { fetchPaymentIntelligence } from '../services/api';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, Zap, ShieldAlert, CreditCard } from 'lucide-react';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function Transactions() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentIntelligence()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  if (!data || data.paymentMethods.length === 0 && data.failureReasons.length === 0) {
     return (
      <div className="flex flex-col items-center justify-center h-96 bg-white rounded-xl border border-slate-200">
        <AlertCircle size={48} className="text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">No payment data yet</h2>
        <p className="text-slate-500 mb-6 max-w-md text-center">Connect your business data to generate payment intelligence.</p>
        <button onClick={() => window.location.href='/onboarding'} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition">
          Connect Data
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Payment Intelligence</h1>
          <p className="text-slate-600 mt-2">Analyze transaction history and payment success rates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 col-span-1 md:col-span-3 lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-800">Overall Success Rate</h2>
          </div>
          <div className="flex flex-col items-center justify-center h-48">
            <h3 className="text-5xl font-extrabold text-slate-800">{data.successRate.toFixed(1)}%</h3>
            <p className="text-slate-500 mt-2 text-center">of all initiated payments are completed successfully.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 col-span-1 lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <ShieldAlert className="text-amber-500" />
            <h2 className="text-lg font-bold text-slate-800">AI Payment Insights</h2>
          </div>
          <div className="space-y-3">
            {data.insights.map((insight: string, idx: number) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3">
                <AlertCircle size={20} className="text-indigo-500 mt-0.5 shrink-0" />
                <p className="text-slate-700 font-medium">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="text-red-500" />
            <h2 className="text-lg font-bold text-slate-800">Failure Reasons</h2>
          </div>
          <div className="flex-1">
            {data.failureReasons.length === 0 ? (
               <div className="flex items-center justify-center h-full text-slate-500">No failed transactions found</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.failureReasons}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.failureReasons.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="text-blue-500" />
            <h2 className="text-lg font-bold text-slate-800">Payment Methods Breakdown</h2>
          </div>
          <div className="flex-1">
            {data.paymentMethods.length === 0 ? (
               <div className="flex items-center justify-center h-full text-slate-500">No payment method data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.paymentMethods}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.paymentMethods.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
