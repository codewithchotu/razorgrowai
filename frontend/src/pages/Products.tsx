import { useState, useEffect } from 'react';
import { fetchProducts, fetchProductInsights } from '../services/api';
import { ShoppingBag, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then(setProducts).finally(() => setLoading(false));
    fetchProductInsights().then(setInsights).catch(console.error);
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-white rounded-xl border border-slate-200">
        <ShoppingBag size={48} className="text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">No product data yet</h2>
        <p className="text-slate-500 mb-6 max-w-md text-center">Import your transaction data to discover product opportunities.</p>
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
          <h1 className="text-3xl font-bold text-slate-800">Product Intelligence</h1>
          <p className="text-slate-600 mt-2">Analyze product performance and discover cross-sell opportunities.</p>
        </div>
      </div>

      {insights.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 border-b pb-2 mb-4 flex items-center gap-2">
            <TrendingUp className="text-indigo-600" /> AI Product Insights
          </h2>
          <div className="space-y-4">
            {insights.map((insight, idx) => (
              <div key={idx} className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-indigo-900 mb-1">Cross-Sell Opportunity: {insight.sourceProduct} + {insight.recommendedProduct}</p>
                  <p className="text-indigo-800 text-sm">{insight.reason}</p>
                  <div className="flex gap-4 mt-2 text-xs font-bold text-indigo-600">
                    <span>Confidence: {insight.confidence}%</span>
                    <span>Expected Impact: ₹{insight.expectedRevenueOpportunity}</span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 transition">
                  Create Upsell Action
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Units Sold</th>
                <th className="p-4 font-medium">Revenue</th>
                <th className="p-4 font-medium">Conversion</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-800">{p.name}</td>
                  <td className="p-4">₹{p.price}</td>
                  <td className="p-4">{p.unitsSold}</td>
                  <td className="p-4 font-medium text-emerald-600">₹{p.revenue}</td>
                  <td className="p-4">{p.conversion.toFixed(1)}%</td>
                  <td className="p-4">
                     <span className={`px-2 py-1 text-xs font-bold rounded ${p.status === 'Excellent' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {p.status}
                    </span>
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
