import { useState, useEffect } from 'react';
import { fetchCustomers } from '../services/api';
import { Link } from 'react-router-dom';
import { Users, Search } from 'lucide-react';

export default function Customers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers()
      .then(setCustomers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  if (customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-white rounded-xl border border-slate-200">
        <Users size={48} className="text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">No customer data yet</h2>
        <p className="text-slate-500 mb-6 max-w-md text-center">Connect Razorpay or upload transaction data to generate customer intelligence.</p>
        <Link to="/onboarding" className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition">
          Connect Data
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Customer Intelligence</h1>
          <p className="text-slate-600 mt-2">Analyze customer segments and behavior.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search customers..." className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64" />
          </div>
          <div className="text-sm text-slate-500 font-medium">Total: {customers.length} Customers</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Segment</th>
                <th className="p-4 font-medium">LTV</th>
                <th className="p-4 font-medium">Orders</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{c.name}</div>
                    <div className="text-sm text-slate-500">{c.email}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded">
                      {c.segment}
                    </span>
                  </td>
                  <td className="p-4 font-medium">₹{c.totalSpent}</td>
                  <td className="p-4">{c.purchaseCount}</td>
                  <td className="p-4 text-right">
                    <Link to={`/dashboard/customers/${c._id}`} className="text-indigo-600 font-medium hover:underline">
                      View Profile
                    </Link>
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
