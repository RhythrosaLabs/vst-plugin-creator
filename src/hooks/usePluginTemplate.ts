import { Plugin } from '../types/plugin';
import { templates } from '../data/pluginTemplates';

export function usePluginTemplate() {
  const createFromTemplate = (templateId: string): Plugin => {
    const template = templates[templateId];
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    return {
      ...template,
      id: `plugin_${Date.now()}`,
      metadata: {
        ...template.metadata,
        uniqueId: `com.vstplugin.${Date.now()}`
      }
    };
  };

  return { createFromTemplate };
}