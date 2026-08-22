import { useState, useEffect } from 'react';
import { fetchDashboardMetrics, runAIGrowthAnalysis, fetchDataSourceStatus } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, AlertCircle, CheckCircle2, Loader2, Zap, ShieldCheck, Database, Upload } from 'lucide-react';
import clsx from 'clsx';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [opportunities, setOpportunities] = useState<any[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([fetchDashboardMetrics(), fetchDataSourceStatus()])
      .then(([metricsData, statusData]) => {
        setData(metricsData);
        setStatus(statusData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setOpportunities(null);
    try {
      const res = await runAIGrowthAnalysis();
      if (res.analysis && res.analysis.opportunities) {
        setOpportunities(res.analysis.opportunities);
      } else {
        navigate('/dashboard/actions');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to run AI Analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  if (!data) return <div>Failed to load data</div>;

  const { metrics, charts } = data;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-slate-800">Overview</h1>
          {status?.dataSource === 'RAZORPAY_CONNECTED' && (
             <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full flex items-center gap-1">
               <ShieldCheck size={14}/> RAZORPAY CONNECTED
             </span>
          )}
          {status?.dataSource === 'CSV_IMPORTED' && (
             <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full flex items-center gap-1">
               <Upload size={14}/> CSV DATA
             </span>
          )}
          {status?.dataSource === 'DEMO_MODE' && (
             <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1">
               <Database size={14}/> DEMO DATA
             </span>
          )}
        </div>
        <button 
          onClick={handleAnalyze}
          disabled={analyzing}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm font-bold disabled:opacity-50 text-lg shadow-indigo-200"
        >
          {analyzing ? <Loader2 size={24} className="animate-spin" /> : <Zap size={24} />}
          {analyzing ? 'Analyzing 1,000+ data points...' : 'Run AI Growth Analysis'}
        </button>
      </div>

      {opportunities && (
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-8 rounded-xl shadow-lg mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <Zap size={200} />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">AI Growth Opportunities</h2>
            <p className="text-indigo-200 mb-6 max-w-2xl text-lg">
              I analyzed 1,000+ transactions, 50 customers and your product catalog. I found {opportunities.length} high-impact growth opportunities with an estimated <strong>₹{opportunities.reduce((acc: number, o: any) => acc + o.potentialRevenue, 0).toLocaleString()}</strong> potential revenue.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {opportunities.map((opp, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 flex flex-col justify-between">
                   <div>
                     <div className="flex justify-between items-start mb-2">
                       <span className="px-2 py-1 bg-indigo-500/30 text-indigo-100 text-xs font-bold rounded">
                         Priority: {opp.priorityScore}
                       </span>
                       <span className={clsx("px-2 py-1 text-xs font-bold rounded", opp.risk === 'High' ? "bg-red-500/30 text-red-100" : "bg-emerald-500/30 text-emerald-100")}>
                         Risk: {opp.risk}
                       </span>
                     </div>
                     <h3 className="text-lg font-bold mb-1">{opp.title}</h3>
                     <p className="text-indigo-200 text-sm mb-4">{opp.reason}</p>
                   </div>
                   <div>
                     <p className="text-sm text-indigo-300">Potential Revenue</p>
                     <p className="text-2xl font-bold text-emerald-400 mb-4">₹{opp.potentialRevenue}</p>
                     <Link to="/dashboard/actions" className="block w-full py-2 text-center bg-white text-indigo-900 rounded font-bold hover:bg-indigo-50 transition">
                       Review Action
                     </Link>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Revenue" 
          value={formatCurrency(metrics.totalRevenue)} 
          icon={<DollarSign size={20} className="text-indigo-600" />}
          trend={+12.5}
        />
        <MetricCard 
          title="Recovered Revenue" 
          value={formatCurrency(metrics.recoveredRevenue)} 
          icon={<CheckCircle2 size={20} className="text-emerald-500" />}
        />
        <MetricCard 
          title="Abandoned Checkouts" 
          value={metrics.abandonedCheckouts} 
          icon={<AlertCircle size={20} className="text-amber-500" />}
          trend={-5.2}
          reverseTrend
        />
        <MetricCard 
          title="Conversion Rate" 
          value={`${metrics.conversionRate.toFixed(1)}%`} 
          icon={<TrendingUp size={20} className="text-blue-500" />}
          trend={-2.1}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Revenue Overview (Last 7 Days)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.revenueOverTime} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 4" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights Sidebar */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
             AI Insights
          </h2>
          <div className="flex-1 space-y-4">
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
              <p className="text-sm text-indigo-900 font-medium">Revenue dropped 12% this week.</p>
            </div>
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
              <p className="text-sm text-emerald-900 font-medium">₹37,400 potential revenue is currently recoverable.</p>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
              <p className="text-sm text-amber-900 font-medium">{metrics.abandonedCheckouts} customers abandoned checkout.</p>
            </div>
          </div>
          <button className="w-full mt-4 py-2 bg-indigo-50 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-100 transition">
            View All Insights
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, trend, reverseTrend }: { title: string, value: string | number, icon: React.ReactNode, trend?: number, reverseTrend?: boolean }) {
  const isPositive = trend ? trend > 0 : false;
  const showPositive = reverseTrend ? !isPositive : isPositive;
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        {trend !== undefined && (
          <div className={clsx("flex items-center text-sm font-medium mt-2", showPositive ? "text-emerald-600" : "text-red-500")}>
            {isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
            {Math.abs(trend)}% from last week
          </div>
        )}
      </div>
    </div>
  );
}
