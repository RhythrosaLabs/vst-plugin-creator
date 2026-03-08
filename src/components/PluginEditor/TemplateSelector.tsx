import React from 'react';
import { templates } from '../../data/pluginTemplates';

interface TemplateSelectorProps {
  onSelectTemplate: (templateId: string) => void;
}

export function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {Object.entries(templates).map(([id, template]) => (
        <button
          key={id}
          onClick={() => onSelectTemplate(id)}
          className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
          <p className="text-sm text-gray-600 mb-4">{template.metadata.description}</p>
          <div className="text-xs text-gray-500">
            <p>Category: {template.metadata.category}</p>
            <p>Parameters: {template.parameters.length}</p>
          </div>
        </button>
      ))}
    </div>
  );
}