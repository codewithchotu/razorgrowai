import { useState } from 'react';
import { Save } from 'lucide-react';

export default function GuardrailsConfig() {
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('Guardrails saved successfully');
    }, 1000);
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">AI Guardrails</h1>
      <p className="text-slate-600 mb-8">Configure the operating limits for your AI agents to ensure they align with your business rules.</p>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Discount Limits</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Max Discount Percentage</label>
              <input type="number" defaultValue={15} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Max Discount Amount (₹)</label>
              <input type="number" defaultValue={1000} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 mt-8">Approvals</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded" />
              <span className="text-slate-700 font-medium">Require manual approval for all discounts</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded" />
              <span className="text-slate-700 font-medium">Require manual approval before sending payment links</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 mt-8">Campaign Limits</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Max Daily AI Actions</label>
              <input type="number" defaultValue={50} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Max Campaign Budget (₹)</label>
              <input type="number" defaultValue={5000} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t mt-8 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition flex items-center gap-2"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
}
