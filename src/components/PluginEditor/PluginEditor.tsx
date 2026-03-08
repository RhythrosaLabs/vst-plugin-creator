import React, { useState } from 'react';
import { Settings, Music4, Sliders, Palette, Code2, Check, Pencil } from 'lucide-react';
import { Plugin } from '../../types/plugin';
import ParameterList from './ParameterList';
import InterfaceEditor from './InterfaceEditor';
import { ProcessingEditor } from './CodeEditor/ProcessingEditor';

interface PluginEditorProps {
  plugin: Plugin;
  onUpdatePlugin: (plugin: Plugin) => void;
}

type Tab = 'parameters' | 'interface' | 'code' | 'settings';

export default function PluginEditor({ plugin, onUpdatePlugin }: PluginEditorProps) {
  const [activeTab, setActiveTab] = useState<Tab>('interface');
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(plugin.name);

  const handleNameSave = () => {
    if (nameValue.trim()) {
      onUpdatePlugin({ ...plugin, name: nameValue.trim() });
    } else {
      setNameValue(plugin.name);
    }
    setEditingName(false);
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'interface', label: 'Interface', icon: <Palette className="w-4 h-4" /> },
    { id: 'parameters', label: 'Parameters', icon: <Sliders className="w-4 h-4" /> },
    { id: 'code', label: 'Code', icon: <Code2 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 flex flex-col h-full">
      {/* Plugin header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-800">
        {plugin.type === 'effect' ? (
          <Sliders className="w-5 h-5 text-blue-400 flex-shrink-0" />
        ) : (
          <Music4 className="w-5 h-5 text-purple-400 flex-shrink-0" />
        )}
        {editingName ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              autoFocus
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={(e) => { if (e.key === 'Enter') handleNameSave(); if (e.key === 'Escape') { setNameValue(plugin.name); setEditingName(false); } }}
              className="bg-gray-800 text-white rounded px-2 py-0.5 text-lg font-semibold border border-blue-500 outline-none flex-1 min-w-0"
            />
            <button onClick={handleNameSave} className="p-1 text-green-400 hover:text-green-300"><Check className="w-4 h-4" /></button>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-white truncate">{plugin.name}</h2>
            <button
              onClick={() => { setNameValue(plugin.name); setEditingName(true); }}
              className="p-1 text-gray-600 hover:text-gray-300 flex-shrink-0"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700 flex-shrink-0">
          {plugin.metadata.category}
        </span>
        <button
          onClick={() => onUpdatePlugin({ ...plugin, type: plugin.type === 'effect' ? 'instrument' : 'effect' })}
          className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-500 transition-colors flex-shrink-0"
          title="Toggle effect/instrument"
        >
          {plugin.type === 'effect' ? 'FX' : 'INST'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto p-5">
        {activeTab === 'parameters' && (
          <ParameterList
            parameters={plugin.parameters}
            onUpdateParameters={(parameters) => onUpdatePlugin({ ...plugin, parameters })}
          />
        )}
        {activeTab === 'interface' && (
          <InterfaceEditor plugin={plugin} onUpdatePlugin={onUpdatePlugin} />
        )}
        {activeTab === 'code' && (
          <ProcessingEditor
            plugin={plugin}
            onUpdateCode={(code) => onUpdatePlugin({ ...plugin, code })}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsEditor plugin={plugin} onUpdatePlugin={onUpdatePlugin} />
        )}
      </div>
    </div>
  );
}

function SettingsEditor({ plugin, onUpdatePlugin }: PluginEditorProps) {
  const meta = plugin.metadata;
  const update = (key: keyof typeof meta, value: string) =>
    onUpdatePlugin({ ...plugin, metadata: { ...meta, [key]: value } });

  return (
    <div className="max-w-xl space-y-5">
      <h3 className="text-base font-semibold text-gray-300">Plugin Metadata</h3>

      {[
        { key: 'manufacturer' as const, label: 'Manufacturer', placeholder: 'e.g. Acme Audio' },
        { key: 'version' as const, label: 'Version', placeholder: '1.0.0' },
        { key: 'category' as const, label: 'Category', placeholder: 'e.g. Effect, Dynamics, Synth' },
        { key: 'description' as const, label: 'Description', placeholder: 'Describe your plugin...' },
        { key: 'uniqueId' as const, label: 'Unique ID', placeholder: 'com.yourcompany.pluginname' },
      ].map(({ key, label, placeholder }) => (
        <div key={key}>
          <label className="block text-sm text-gray-400 mb-1">{label}</label>
          {key === 'description' ? (
            <textarea
              rows={3}
              value={meta[key]}
              onChange={(e) => update(key, e.target.value)}
              placeholder={placeholder}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none resize-none"
            />
          ) : (
            <input
              type="text"
              value={meta[key]}
              onChange={(e) => update(key, e.target.value)}
              placeholder={placeholder}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none"
            />
          )}
        </div>
      ))}

      <div className="border-t border-gray-800 pt-5">
        <h3 className="text-base font-semibold text-gray-300 mb-4">Plugin Type</h3>
        <div className="flex gap-3">
          {(['effect', 'instrument'] as const).map((type) => (
            <button
              key={type}
              onClick={() => onUpdatePlugin({ ...plugin, type })}
              className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                plugin.type === type
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
            >
              {type === 'effect' ? <Sliders className="w-4 h-4" /> : <Music4 className="w-4 h-4" />}
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}