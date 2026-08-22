import { useState, useEffect } from 'react';
import { fetchDataSourceStatus } from '../services/api';
import { Database, ShieldCheck, Upload, Download } from 'lucide-react';

export default function DataSources() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDataSourceStatus()
      .then(setStatus)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const downloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "customer_id,customer_name,email,amount,status,payment_method,product,product_id,transaction_date,order_id\n"
      + "C001,John Doe,john@example.com,4999,success,UPI,Wireless Headphones,P001,2026-08-20,O001\n"
      + "C002,Jane Doe,jane@example.com,2999,failed,CARD,Shoes,P002,2026-08-20,O002\n"
      + "C003,Alex Smith,alex@example.com,5999,abandoned,UPI,Smart Watch,P003,2026-08-21,O003";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "razorgrow_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Data Sources</h1>
          <p className="text-slate-600 mt-2">Manage your connected business data.</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Current Data Source</h2>
        
        <div className="flex items-start gap-4 p-6 border border-slate-200 rounded-xl bg-slate-50">
          <div className="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
            {status?.dataSource === 'RAZORPAY_CONNECTED' ? <ShieldCheck size={24}/> : 
             status?.dataSource === 'CSV_IMPORTED' ? <Upload size={24}/> : <Database size={24}/>}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-lg font-bold text-slate-800">
                {status?.dataSource === 'RAZORPAY_CONNECTED' ? 'Razorpay' : 
                 status?.dataSource === 'CSV_IMPORTED' ? 'Transaction CSV' : 
                 status?.dataSource === 'DEMO_MODE' ? 'Demo Store' : 'Not Connected'}
              </h3>
              {status?.dataSource !== 'NOT_CONNECTED' && (
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Connected
                </span>
              )}
            </div>
            
            {status?.dataSource !== 'NOT_CONNECTED' ? (
              <div className="text-slate-600 text-sm space-y-1 mt-3">
                <p>Transactions Synced: <strong>{status?.transactionCount}</strong></p>
                <p>Last Synced: {status?.lastSyncedAt ? new Date(status.lastSyncedAt).toLocaleString() : 'N/A'}</p>
              </div>
            ) : (
              <p className="text-slate-500 text-sm mt-1">No data source connected.</p>
            )}
          </div>
          
          <div>
            <button 
              onClick={() => window.location.href = '/onboarding'}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-100 transition"
            >
              Switch Data Source
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Resources</h2>
        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
          <div>
            <h3 className="font-bold text-slate-800">CSV Import Template</h3>
            <p className="text-sm text-slate-500">Download the required template format for uploading manual transactions.</p>
          </div>
          <button 
            onClick={downloadTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-lg hover:bg-indigo-100 transition"
          >
            <Download size={18} /> Download
          </button>
        </div>
      </div>
    </div>
  );
}
