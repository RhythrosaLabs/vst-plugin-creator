import React from 'react';
import { Parameter } from '../../types/parameter';
import { Plus, Trash2, ChevronDown } from 'lucide-react';
import { parameterCategories } from '../../data/parameterCategories';
import { createParameter } from '../../data/parameterDefaults';
import { generateUniqueId } from '../../utils/idGenerator';

interface ParameterListProps {
  parameters: Parameter[];
  onUpdateParameters: (parameters: Parameter[]) => void;
}

const ADD_PRESETS = [
  { label: 'Gain', fn: () => createParameter('gain', 'input', 'Gain', { min: -60, max: 12, defaultValue: 0, unit: 'dB' }) },
  { label: 'Filter Cutoff', fn: () => createParameter('frequency', 'filter', 'Cutoff', { defaultValue: 1000 }) },
  { label: 'Filter Q', fn: () => createParameter('q', 'filter', 'Resonance', { defaultValue: 1 }) },
  { label: 'Threshold', fn: () => createParameter('gain', 'dynamics', 'Threshold', { min: -60, max: 0, defaultValue: -20, unit: 'dB' }) },
  { label: 'Ratio', fn: () => createParameter('ratio', 'dynamics', 'Ratio', { min: 1, max: 20, defaultValue: 4, unit: ':1', curve: 'exponential' }) },
  { label: 'Attack', fn: () => createParameter('time', 'dynamics', 'Attack', { min: 0.1, max: 100, defaultValue: 10, unit: 'ms', curve: 'logarithmic' }) },
  { label: 'Release', fn: () => createParameter('time', 'dynamics', 'Release', { min: 10, max: 1000, defaultValue: 100, unit: 'ms', curve: 'logarithmic' }) },
  { label: 'Mix / Dry-Wet', fn: () => createParameter('percentage', 'output', 'Mix', { min: 0, max: 100, defaultValue: 50, unit: '%' }) },
  { label: 'LFO Rate', fn: () => createParameter('time', 'modulation', 'Rate', { min: 0.01, max: 20, defaultValue: 1, unit: 'Hz', curve: 'logarithmic' }) },
  { label: 'Depth', fn: () => createParameter('percentage', 'modulation', 'Depth', { min: 0, max: 100, defaultValue: 50, unit: '%' }) },
  { label: 'Delay Time', fn: () => createParameter('time', 'time', 'Delay Time', { min: 1, max: 2000, defaultValue: 250, unit: 'ms', curve: 'logarithmic' }) },
  { label: 'Feedback', fn: () => createParameter('percentage', 'time', 'Feedback', { min: 0, max: 95, defaultValue: 50, unit: '%' }) },
  { label: 'Toggle On/Off', fn: () => createParameter('toggle', 'input', 'Bypass', { min: 0, max: 1, defaultValue: 0 }) },
];

export default function ParameterList({ parameters, onUpdateParameters }: ParameterListProps) {
  const [expandedCategories, setExpandedCategories] = React.useState<string[]>(['input', 'filter', 'dynamics', 'modulation', 'time', 'output']);
  const [showAddMenu, setShowAddMenu] = React.useState(false);

  const handleAddParameter = (fn: () => Parameter) => {
    const param = { ...fn(), id: generateUniqueId() };
    onUpdateParameters([...parameters, param]);
    setShowAddMenu(false);
  };

  const handleRemoveParameter = (parameterId: string) => {
    onUpdateParameters(parameters.filter((p) => p.id !== parameterId));
  };

  const handleUpdateParameter = (parameterId: string, value: number) => {
    onUpdateParameters(parameters.map((p) => (p.id === parameterId ? { ...p, value } : p)));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-semibold text-gray-300">Parameters ({parameters.length})</h3>
        <div className="relative">
          <button
            onClick={() => setShowAddMenu((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
          {showAddMenu && (
            <div className="absolute right-0 top-full mt-1 z-50 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-56 py-1">
              {ADD_PRESETS.map(({ label, fn }) => (
                <button
                  key={label}
                  onClick={() => handleAddParameter(fn)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {parameters.length === 0 && (
        <div className="text-center py-10 text-gray-600 text-sm">
          <p>No parameters yet.</p>
          <p>Click <strong className="text-gray-500">Add</strong> to add your first parameter.</p>
        </div>
      )}

      {Object.entries(parameterCategories).map(([categoryId, category]) => {
        const categoryParams = parameters.filter((p) => p.category === categoryId);
        if (categoryParams.length === 0) return null;
        const Icon = category.icon;
        const expanded = expandedCategories.includes(categoryId);

        return (
          <div key={categoryId} className="border border-gray-800 rounded-xl overflow-hidden">
            <button
              className="w-full px-4 py-3 flex items-center justify-between bg-gray-800 hover:bg-gray-750 transition-colors"
              onClick={() =>
                setExpandedCategories((prev) =>
                  prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
                )
              }
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-300">{category.name}</span>
                <span className="text-xs text-gray-500">({categoryParams.length})</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>

            {expanded && (
              <div className="p-3 space-y-3 bg-gray-900">
                {categoryParams.map((param) => (
                  <div key={param.id} className="bg-gray-800 rounded-lg px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-sm font-medium text-white">{param.name}</span>
                        <span className="ml-2 text-xs text-gray-500">
                          {param.value.toFixed(2)}{param.unit ? ` ${param.unit}` : ''}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveParameter(param.id)}
                        className="p-1.5 hover:bg-gray-700 rounded text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="range"
                      min={param.min}
                      max={param.max}
                      step={param.step ?? (param.max - param.min) / 200}
                      value={param.value}
                      onChange={(e) => handleUpdateParameter(param.id, parseFloat(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>{param.min}{param.unit ? ` ${param.unit}` : ''}</span>
                      <span>{param.max}{param.unit ? ` ${param.unit}` : ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}