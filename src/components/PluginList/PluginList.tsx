import React from 'react';
import { Plus, Music4, Sliders, Trash2 } from 'lucide-react';
import { Plugin } from '../../types/plugin';

interface PluginListProps {
  plugins: Plugin[];
  selectedPluginId: string | null;
  onSelectPlugin: (id: string) => void;
  onCreatePlugin: () => void;
  onDeletePlugin: (id: string) => void;
}

export default function PluginList({
  plugins,
  selectedPluginId,
  onSelectPlugin,
  onCreatePlugin,
  onDeletePlugin,
}: PluginListProps) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 w-56 flex-shrink-0 flex flex-col gap-2">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Plugins</h2>
        <button
          onClick={onCreatePlugin}
          className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          title="Create new plugin"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-1">
        {plugins.length === 0 && (
          <p className="text-xs text-gray-600 text-center py-4">No plugins yet</p>
        )}
        {plugins.map((plugin) => (
          <div
            key={plugin.id}
            className={`group flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer transition-colors ${
              selectedPluginId === plugin.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
            onClick={() => onSelectPlugin(plugin.id)}
          >
            <div className="flex items-center gap-2 min-w-0">
              {plugin.type === 'effect' ? (
                <Sliders className="w-3.5 h-3.5 flex-shrink-0" />
              ) : (
                <Music4 className="w-3.5 h-3.5 flex-shrink-0" />
              )}
              <span className="text-sm truncate">{plugin.name}</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onDeletePlugin(plugin.id); }}
              className={`p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                selectedPluginId === plugin.id ? 'hover:bg-blue-500' : 'hover:bg-gray-700'
              } text-red-400`}
              title="Delete plugin"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}