import { useState, useEffect } from 'react';
import { fetchAuditLogs } from '../services/api';
import { FileText } from 'lucide-react';

export default function AuditLog() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditLogs()
      .then(setLogs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Loading Audit Logs...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">AI Audit Trail</h1>
          <p className="text-slate-600 mt-2">A complete historical log of all AI Agent decisions and executions.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="p-4 font-medium">Timestamp</th>
                <th className="p-4 font-medium">Agent</th>
                <th className="p-4 font-medium">Decision / Opportunity</th>
                <th className="p-4 font-medium">Action Type</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 text-sm text-slate-600 whitespace-nowrap">
                    {new Date(log.updatedAt).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded">
                      {log.agent}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{log.decision}</div>
                    <div className="text-sm text-slate-500 max-w-md truncate">{log.reason}</div>
                  </td>
                  <td className="p-4 font-medium text-slate-700">{log.actionType}</td>
                  <td className="p-4">
                     <span className={`px-2 py-1 text-xs font-bold rounded ${
                       log.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                       log.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                       'bg-amber-100 text-amber-700'
                     }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No AI actions recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
