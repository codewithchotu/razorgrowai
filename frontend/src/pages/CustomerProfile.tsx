import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCustomerProfile, fetchCustomerInsights } from '../services/api';
import { User, Activity, AlertCircle, ShoppingBag, Loader2 } from 'lucide-react';

export default function CustomerProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCustomerProfile(id)
        .then(setProfile)
        .catch(console.error)
        .finally(() => setLoading(false));

      fetchCustomerInsights(id)
        .then(setInsights)
        .catch(console.error);
    }
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading Profile...</div>;
  if (!profile) return <div className="p-8 text-center">Customer not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-16 w-16 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-2xl font-bold">
          {profile.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{profile.name}</h1>
          <p className="text-slate-600">{profile.email} • {profile.phone}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 md:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 border-b pb-2">AI Insights</h2>
          {!insights ? (
            <div className="flex items-center gap-2 text-slate-500"><Loader2 className="animate-spin" size={16}/> Analyzing customer behavior...</div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                <p className="text-sm font-bold text-indigo-900 mb-1">Why is this customer classified as {profile.segment}?</p>
                <p className="text-indigo-800 text-sm">{insights.explanation}</p>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                <p className="text-sm font-bold text-emerald-900 mb-1">Recommended Action</p>
                <p className="text-emerald-800 text-sm">{insights.recommendation}</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 border-b pb-2 mb-4">Metrics</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">Lifetime Value</p>
              <p className="text-xl font-bold text-slate-800">₹{profile.totalSpent}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Orders</p>
              <p className="text-xl font-bold text-slate-800">{profile.purchaseCount}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Segment</p>
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded inline-block mt-1">
                {profile.segment}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
         <h2 className="text-xl font-bold text-slate-800 border-b pb-2 mb-4 flex items-center gap-2">
            <Activity size={20} /> Transaction History
         </h2>
         <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Items</th>
              </tr>
            </thead>
            <tbody>
              {profile.transactions.map((tx: any, i: number) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 text-sm text-slate-600">{new Date(tx.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 font-medium">₹{tx.amount}</td>
                  <td className="p-4">
                     <span className={`px-2 py-1 text-xs font-bold rounded ${tx.status === 'successful' ? 'bg-emerald-100 text-emerald-700' : tx.status === 'abandoned' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    {tx.items.map((it:any) => it.name).join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
