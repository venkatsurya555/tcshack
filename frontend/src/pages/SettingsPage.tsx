import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AppSetting, RoutingRule, Department } from '../types';
import {
  Settings,
  Sliders,
  Clock,
  Shield,
  Save,
  CheckCircle,
  RefreshCw,
  Building
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [settingsList, setSettingsList] = useState<AppSetting[]>([]);
  const [routingRules, setRoutingRules] = useState<RoutingRule[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const [sets, rules, depts] = await Promise.all([
        api.getSettings(),
        api.getRoutingRules(),
        api.getDepartments(),
      ]);
      setSettingsList(sets);
      setRoutingRules(rules);
      setDepartments(depts);
    } catch (err: any) {
      console.error('Error fetching settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleUpdateSetting = async (key: string, value: string) => {
    try {
      await api.updateSetting(key, value);
      setSettingsList((prev) =>
        prev.map((s) => (s.key === key ? { ...s, value } : s))
      );
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateRule = async (ruleId: number, field: string, value: any) => {
    const rule = routingRules.find((r) => r.id === ruleId);
    if (!rule) return;
    const updated = { ...rule, [field]: value };
    try {
      await api.updateRoutingRule(ruleId, {
        department_id: updated.department_id,
        default_priority: updated.default_priority,
        sla_hours: updated.sla_hours,
        is_active: updated.is_active,
      });
      setRoutingRules((prev) => prev.map((r) => (r.id === ruleId ? updated : r)));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">System & Operational Settings</h2>
          <p className="text-xs text-slate-500">
            Configure automated routing rules, SLA targets, rating thresholds, and notification protocols.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold animate-pulse">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Sliders className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Complaint Rules & SLA Preferences
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {settingsList.map((s) => (
            <div key={s.key} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <label className="font-bold text-slate-800 block">{s.key.replace(/_/g, ' ').toUpperCase()}</label>
              <p className="text-[11px] text-slate-500">{s.description}</p>
              <div className="pt-2 flex items-center space-x-2">
                <input
                  type="text"
                  defaultValue={s.value}
                  onBlur={(e) => handleUpdateSetting(s.key, e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg font-semibold"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Department Routing Rules */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Automatic Department Routing Matrix
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Rules active on bill feedback submission</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/60 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-4">Issue Category</th>
                <th className="py-2.5 px-4">Assigned Department</th>
                <th className="py-2.5 px-4">Default Priority</th>
                <th className="py-2.5 px-4">SLA Target (Hours)</th>
                <th className="py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {routingRules.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60">
                  <td className="py-2.5 px-4 font-bold text-slate-900">{r.issue_category}</td>
                  <td className="py-2.5 px-4">
                    <select
                      value={r.department_id}
                      onChange={(e) => handleUpdateRule(r.id, 'department_id', Number(e.target.value))}
                      className="text-xs font-semibold bg-white border border-slate-200 rounded p-1"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2.5 px-4">
                    <select
                      value={r.default_priority}
                      onChange={(e) => handleUpdateRule(r.id, 'default_priority', e.target.value)}
                      className="text-xs font-semibold bg-white border border-slate-200 rounded p-1"
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </td>
                  <td className="py-2.5 px-4">
                    <input
                      type="number"
                      min={1}
                      max={72}
                      value={r.sla_hours}
                      onChange={(e) => handleUpdateRule(r.id, 'sla_hours', Number(e.target.value))}
                      className="w-16 text-xs p-1 bg-white border border-slate-200 rounded font-semibold text-center"
                    />
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="text-emerald-700 font-bold text-[11px]">ACTIVE</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
