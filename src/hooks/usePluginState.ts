import { useState, useCallback } from 'react';
import { Plugin } from '../types/plugin';
import { Parameter } from '../types/parameter';
import { Widget } from '../types/widget';

export function usePluginState(initialPlugin?: Plugin) {
  const [plugin, setPlugin] = useState<Plugin | undefined>(initialPlugin);

  const updateParameter = useCallback((parameterId: string, value: number) => {
    setPlugin(currentPlugin => {
      if (!currentPlugin) return currentPlugin;
      
      return {
        ...currentPlugin,
        parameters: currentPlugin.parameters.map(param =>
          param.id === parameterId ? { ...param, value } : param
        )
      };
    });
  }, []);

  const updateWidget = useCallback((widgetId: string, updates: Partial<Widget>) => {
    setPlugin(currentPlugin => {
      if (!currentPlugin) return currentPlugin;

      return {
        ...currentPlugin,
        interface: {
          ...currentPlugin.interface,
          widgets: currentPlugin.interface.widgets.map(widget =>
            widget.id === widgetId ? { ...widget, ...updates } : widget
          )
        }
      };
    });
  }, []);

  const addParameter = useCallback((parameter: Parameter) => {
    setPlugin(currentPlugin => {
      if (!currentPlugin) return currentPlugin;

      return {
        ...currentPlugin,
        parameters: [...currentPlugin.parameters, parameter]
      };
    });
  }, []);

  const removeParameter = useCallback((parameterId: string) => {
    setPlugin(currentPlugin => {
      if (!currentPlugin) return currentPlugin;

      return {
        ...currentPlugin,
        parameters: currentPlugin.parameters.filter(param => param.id !== parameterId)
      };
    });
  }, []);

  return {
    plugin,
    setPlugin,
    updateParameter,
    updateWidget,
    addParameter,
    removeParameter
  };
}