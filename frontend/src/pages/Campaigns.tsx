import { useState, useEffect } from 'react';
import { generateCampaign, fetchDataSourceStatus } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Megaphone, Loader2, Database } from 'lucide-react';

export default function Campaigns() {
  const [goal, setGoal] = useState('');
  const [generating, setGenerating] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDataSourceStatus()
      .then(setStatus)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal) return;
    setGenerating(true);
    try {
      await generateCampaign(goal);
      navigate('/dashboard/actions');
    } catch (error) {
      console.error(error);
      alert('Failed to generate campaign.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  if (status?.dataSource === 'NOT_CONNECTED') {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-white rounded-xl border border-slate-200">
        <Database size={48} className="text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">No data connected</h2>
        <p className="text-slate-500 mb-6 max-w-md text-center">Connect your business data to use the AI Campaign Generator.</p>
        <button onClick={() => window.location.href='/onboarding'} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition">
          Connect Data
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">AI Campaign Generator</h1>
          <p className="text-slate-600 mt-2">Create targeted campaigns using natural language. The AI will design the offer and target audience based on your guardrails.</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Campaign Goal</label>
            <textarea 
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Recover abandoned carts from high-value customers..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px]"
              required
            />
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg flex items-start gap-3">
            <Megaphone className="text-indigo-600 mt-0.5 shrink-0" size={20} />
            <p className="text-sm text-indigo-900">
              When you generate a campaign, it will be added to the <strong>AI Action Center</strong> as a Draft/Pending Approval. It will not be sent to customers until you review and approve it.
            </p>
          </div>

          <div className="flex justify-end">
             <button 
                type="submit"
                disabled={generating || !goal}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm font-medium disabled:opacity-50"
              >
                {generating ? <Loader2 size={18} className="animate-spin" /> : <Megaphone size={18} />}
                {generating ? 'Generating Campaign...' : 'Generate AI Campaign'}
              </button>
          </div>
        </form>
      </div>
    </div>
  );
}
