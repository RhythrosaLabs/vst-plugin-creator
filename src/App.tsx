import React, { useState, useEffect } from 'react';
import { Plugin } from './types/plugin';
import PluginList from './components/PluginList/PluginList';
import PluginEditor from './components/PluginEditor/PluginEditor';
import { exportPlugin } from './utils/exportPlugin';
import { templates } from './data/pluginTemplates';
import { generateUniqueId } from './utils/idGenerator';
import { Music4, Sliders, X, Download } from 'lucide-react';

const STORAGE_KEY = 'vst-plugin-creator-plugins';

function loadPlugins(): Plugin[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePlugins(plugins: Plugin[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plugins));
  } catch {
    // storage full — fail silently
  }
}

function App() {
  const [plugins, setPlugins] = useState<Plugin[]>(loadPlugins);
  const [selectedPluginId, setSelectedPluginId] = useState<string | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [exportStatus, setExportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Persist on every change
  useEffect(() => {
    savePlugins(plugins);
  }, [plugins]);

  const handleCreatePlugin = (templateId: string) => {
    const template = templates[templateId];
    const newPlugin: Plugin = {
      ...template,
      id: generateUniqueId(),
      name: template.name,
      metadata: {
        ...template.metadata,
        uniqueId: `com.vstplugin.${generateUniqueId()}`,
      },
    };
    setPlugins((prev) => [...prev, newPlugin]);
    setSelectedPluginId(newPlugin.id);
    setShowTemplateModal(false);
  };

  const handleUpdatePlugin = (updatedPlugin: Plugin) => {
    setPlugins((prev) => prev.map((p) => (p.id === updatedPlugin.id ? updatedPlugin : p)));
  };

  const handleDeletePlugin = (id: string) => {
    setPlugins((prev) => prev.filter((p) => p.id !== id));
    if (selectedPluginId === id) setSelectedPluginId(null);
  };

  const handleExportPlugin = async () => {
    const plugin = plugins.find((p) => p.id === selectedPluginId);
    if (!plugin) return;
    try {
      await exportPlugin(plugin);
      setExportStatus({ type: 'success', message: `${plugin.name}.zip exported!` });
    } catch {
      setExportStatus({ type: 'error', message: 'Export failed. Please try again.' });
    }
    setTimeout(() => setExportStatus(null), 3000);
  };

  const selectedPlugin = plugins.find((p) => p.id === selectedPluginId);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 shadow-lg">
        <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Sliders className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">VST Plugin Creator</h1>
              <p className="text-xs text-gray-400">Browser-based VST3 plugin builder</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {selectedPlugin && (
              <button
                onClick={handleExportPlugin}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Export toast */}
      {exportStatus && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-lg shadow-xl text-sm font-medium flex items-center gap-2 transition-all ${
            exportStatus.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {exportStatus.message}
        </div>
      )}

      {/* Template selection modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-700">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold">Choose a Template</h2>
              <button onClick={() => setShowTemplateModal(false)} className="p-1 hover:bg-gray-700 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {Object.entries(templates).map(([id, template]) => (
                <button
                  key={id}
                  onClick={() => handleCreatePlugin(id)}
                  className="group text-left p-5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500 transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {template.type === 'effect' ? (
                      <Sliders className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                    ) : (
                      <Music4 className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
                    )}
                    <span className="font-semibold text-white">{template.name}</span>
                  </div>
                  <p className="text-xs text-gray-400">{template.metadata.description}</p>
                  <div className="mt-3 flex gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-gray-700 rounded-full text-gray-300">{template.metadata.category}</span>
                    {template.parameters.length > 0 && (
                      <span className="px-2 py-0.5 bg-gray-700 rounded-full text-gray-300">
                        {template.parameters.length} params
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main layout */}
      <main className="flex-1 max-w-screen-2xl w-full mx-auto px-6 py-4 flex gap-4">
        <PluginList
          plugins={plugins}
          selectedPluginId={selectedPluginId}
          onSelectPlugin={setSelectedPluginId}
          onCreatePlugin={() => setShowTemplateModal(true)}
          onDeletePlugin={handleDeletePlugin}
        />
        <div className="flex-1 min-w-0">
          {selectedPlugin ? (
            <PluginEditor
              plugin={selectedPlugin}
              onUpdatePlugin={handleUpdatePlugin}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <div className="w-20 h-20 rounded-2xl bg-gray-800 flex items-center justify-center mb-4">
                <Sliders className="w-10 h-10 text-gray-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-400 mb-2">No plugin selected</h2>
              <p className="text-sm text-gray-600 mb-6">Create a new plugin or select one from the list</p>
              <button
                onClick={() => setShowTemplateModal(true)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                + Create Plugin
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

