import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Plugin } from '../../../types/plugin';

interface ProcessingEditorProps {
  plugin: Plugin;
  onUpdateCode: (code: { cpp: string; header: string }) => void;
}

export function ProcessingEditor({ plugin, onUpdateCode }: ProcessingEditorProps) {
  const [activeFile, setActiveFile] = useState<'cpp' | 'header'>('cpp');

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveFile('cpp')}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            activeFile === 'cpp'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          Source (.cpp)
        </button>
        <button
          onClick={() => setActiveFile('header')}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            activeFile === 'header'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          Header (.h)
        </button>
        <span className="ml-auto text-xs text-gray-600">
          {activeFile === 'cpp' ? plugin.name + '.cpp' : plugin.name + '.h'}
        </span>
      </div>
      <div className="h-[500px] border border-gray-700 rounded-xl overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="cpp"
          value={activeFile === 'cpp' ? plugin.code.cpp : plugin.code.header}
          onChange={(value) =>
            onUpdateCode(
              activeFile === 'cpp'
                ? { ...plugin.code, cpp: value || '' }
                : { ...plugin.code, header: value || '' }
            )
          }
          theme="vs-dark"
          options={{
            minimap: { enabled: true },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
          }}
        />
      </div>
      <p className="text-xs text-gray-600">
        Edit the C++ source code for your plugin. This code will be exported when you click Export.
      </p>
    </div>
  );
}