import React, { useState, useRef } from 'react';
import { Plugin } from '../../types/plugin';
import { Widget, WidgetType } from '../../types/widget';
import WidgetComponent from './widgets/WidgetComponent';
import WidgetToolbox from './widgets/WidgetToolbox';
import WidgetProperties from './widgets/WidgetProperties';
import { Trash2 } from 'lucide-react';

interface InterfaceEditorProps {
  plugin: Plugin;
  onUpdatePlugin: (plugin: Plugin) => void;
}

export default function InterfaceEditor({ plugin, onUpdatePlugin }: InterfaceEditorProps) {
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleAddWidget = (type: WidgetType) => {
    const newWidget: Widget = {
      id: Date.now().toString(),
      type,
      x: 50 + Math.random() * 100,
      y: 50 + Math.random() * 60,
      width: type === 'knob' ? 80 : type === 'fader' ? 40 : type === 'display' ? 120 : type === 'label' ? 80 : type === 'meter' ? 40 : type === 'oscilloscope' ? 160 : type === 'spectrum' ? 160 : 80,
      height: type === 'fader' ? 120 : type === 'knob' ? 80 : type === 'display' ? 40 : type === 'meter' ? 120 : type === 'oscilloscope' ? 80 : type === 'spectrum' ? 80 : 40,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      value: 0,
      min: 0,
      max: 1,
      defaultValue: 0,
      style: {
        backgroundColor: 'transparent',
        borderRadius: '4px',
      },
    };

    onUpdatePlugin({
      ...plugin,
      interface: { ...plugin.interface, widgets: [...plugin.interface.widgets, newWidget] },
    });
    setSelectedWidgetId(newWidget.id);
  };

  const handleWidgetDrag = (id: string, x: number, y: number) => {
    onUpdatePlugin({
      ...plugin,
      interface: {
        ...plugin.interface,
        widgets: plugin.interface.widgets.map((w) => w.id === id ? { ...w, x, y } : w),
      },
    });
  };

  const handleWidgetUpdate = (updatedWidget: Widget) => {
    onUpdatePlugin({
      ...plugin,
      interface: {
        ...plugin.interface,
        widgets: plugin.interface.widgets.map((w) => w.id === updatedWidget.id ? updatedWidget : w),
      },
    });
  };

  const handleDeleteWidget = () => {
    if (!selectedWidgetId) return;
    onUpdatePlugin({
      ...plugin,
      interface: {
        ...plugin.interface,
        widgets: plugin.interface.widgets.filter((w) => w.id !== selectedWidgetId),
      },
    });
    setSelectedWidgetId(null);
  };

  const selectedWidget = plugin.interface.widgets.find((w) => w.id === selectedWidgetId);

  return (
    <div className="flex flex-col gap-4">
      {/* Canvas controls */}
      <div className="flex items-center gap-4 text-sm">
        <label className="flex items-center gap-2">
          <span className="text-gray-600">BG Color</span>
          <input
            type="color"
            value={plugin.interface.backgroundColor}
            onChange={(e) =>
              onUpdatePlugin({ ...plugin, interface: { ...plugin.interface, backgroundColor: e.target.value } })
            }
            className="w-8 h-8 rounded cursor-pointer border border-gray-300"
          />
        </label>
        <label className="flex items-center gap-2">
          <span className="text-gray-600">W</span>
          <input
            type="number"
            value={plugin.interface.width}
            min={200} max={1200} step={10}
            onChange={(e) =>
              onUpdatePlugin({ ...plugin, interface: { ...plugin.interface, width: parseInt(e.target.value) || 600 } })
            }
            className="w-20 border border-gray-300 rounded px-2 py-1"
          />
        </label>
        <label className="flex items-center gap-2">
          <span className="text-gray-600">H</span>
          <input
            type="number"
            value={plugin.interface.height}
            min={100} max={900} step={10}
            onChange={(e) =>
              onUpdatePlugin({ ...plugin, interface: { ...plugin.interface, height: parseInt(e.target.value) || 400 } })
            }
            className="w-20 border border-gray-300 rounded px-2 py-1"
          />
        </label>
        {selectedWidgetId && (
          <button
            onClick={handleDeleteWidget}
            className="ml-auto flex items-center gap-1 px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
          >
            <Trash2 className="w-4 h-4" />
            Delete Widget
          </button>
        )}
      </div>

      <div className="flex gap-4">
        <WidgetToolbox onAddWidget={handleAddWidget} />
        <div className="flex-1 overflow-auto">
          <div
            ref={canvasRef}
            className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
            style={{
              width: plugin.interface.width,
              height: plugin.interface.height,
              backgroundColor: plugin.interface.backgroundColor,
              minWidth: plugin.interface.width,
            }}
            onClick={() => setSelectedWidgetId(null)}
          >
            {plugin.interface.widgets.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-gray-400 text-sm">Add widgets from the toolbox</p>
              </div>
            )}
            {plugin.interface.widgets.map((widget) => (
              <WidgetComponent
                key={widget.id}
                widget={widget}
                selected={widget.id === selectedWidgetId}
                onSelect={() => setSelectedWidgetId(widget.id)}
                onDrag={handleWidgetDrag}
                onUpdate={handleWidgetUpdate}
                containerRef={canvasRef}
              />
            ))}
          </div>
        </div>
        {selectedWidget && (
          <WidgetProperties
            widget={selectedWidget}
            parameters={plugin.parameters}
            onUpdate={handleWidgetUpdate}
            onClose={() => setSelectedWidgetId(null)}
          />
        )}
      </div>
    </div>
  );
}