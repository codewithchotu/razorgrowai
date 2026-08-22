import { useState, useEffect } from 'react';
import { fetchPendingActions, approveAiAction, rejectAiAction } from '../services/api';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import clsx from 'clsx';

export default function AiActionCenter() {
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadActions = () => {
    setLoading(true);
    fetchPendingActions()
      .then(setActions)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadActions();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await approveAiAction(id);
      loadActions();
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectAiAction(id);
      loadActions();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Actions...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">AI Action Center</h1>
          <p className="text-slate-600 mt-2">Review and approve actions recommended by the AI Growth Agent.</p>
        </div>
      </div>

      {actions.length === 0 ? (
        <div className="bg-white p-12 rounded-xl text-center shadow-sm border border-slate-100">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800">You're all caught up!</h2>
          <p className="text-slate-600 mt-2">No pending AI actions require your approval.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {actions.map((action) => (
            <div key={action._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded">
                      {action.agent}
                    </span>
                    <span className={clsx(
                      "px-2 py-1 text-xs font-bold rounded",
                      action.riskLevel === 'High' ? "bg-red-100 text-red-700" :
                      action.riskLevel === 'Medium' ? "bg-amber-100 text-amber-700" :
                      "bg-emerald-100 text-emerald-700"
                    )}>
                      Risk: {action.riskLevel}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{action.decision}</h3>
                  <p className="text-slate-600 mt-2 text-sm max-w-2xl">{action.reason}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-500">Expected Impact</p>
                  <p className="text-xl font-bold text-emerald-600">₹{action.expectedRevenueImpact}</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-sm font-bold text-slate-700 mb-1">Recommended Action:</p>
                <p className="text-slate-800">{action.recommendedAction}</p>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button 
                  onClick={() => handleReject(action._id)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition"
                >
                  Reject
                </button>
                <button 
                  onClick={() => handleApprove(action._id)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition flex items-center gap-2"
                >
                  <CheckCircle size={18} /> Approve Action
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
