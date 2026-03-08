import React from 'react';
import { X } from 'lucide-react';
import { Widget } from '../../../types/widget';
import { Parameter } from '../../../types/parameter';

interface WidgetPropertiesProps {
  widget: Widget;
  parameters: Parameter[];
  onUpdate: (widget: Widget) => void;
  onClose: () => void;
}

export default function WidgetProperties({ widget, parameters, onUpdate, onClose }: WidgetPropertiesProps) {
  const linkedParameter = parameters.find((p) => p.id === widget.parameterId);

  const handleParameterLink = (parameterId: string) => {
    if (parameterId) {
      const parameter = parameters.find((p) => p.id === parameterId);
      if (parameter) {
        onUpdate({ ...widget, parameterId, min: parameter.min, max: parameter.max, value: parameter.value, defaultValue: parameter.defaultValue });
      }
    } else {
      onUpdate({ ...widget, parameterId: undefined });
    }
  };

  const field = (label: string, children: React.ReactNode) => (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  );

  const inputCls = 'w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-white focus:border-blue-500 focus:outline-none';

  return (
    <div className="w-56 bg-gray-800 rounded-xl border border-gray-700 p-4 flex-shrink-0">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-200">Properties</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded text-gray-500"><X className="w-4 h-4" /></button>
      </div>

      <div className="space-y-3">
        {field('Label',
          <input type="text" value={widget.label} onChange={(e) => onUpdate({ ...widget, label: e.target.value })} className={inputCls} />
        )}

        {field('Link to Parameter',
          <select value={widget.parameterId || ''} onChange={(e) => handleParameterLink(e.target.value)} className={inputCls}>
            <option value="">None</option>
            {parameters.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        )}

        {linkedParameter && (
          <div className="px-3 py-2 bg-blue-900/40 border border-blue-800 rounded-lg">
            <p className="text-xs text-blue-300 font-medium">{linkedParameter.name}</p>
            <p className="text-xs text-blue-400 mt-0.5">{linkedParameter.min} – {linkedParameter.max}{linkedParameter.unit ? ` ${linkedParameter.unit}` : ''}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          {field('Width',
            <input type="number" value={widget.width} min={10} max={400} onChange={(e) => onUpdate({ ...widget, width: Math.max(10, parseInt(e.target.value) || 10) })} className={inputCls} />
          )}
          {field('Height',
            <input type="number" value={widget.height} min={10} max={400} onChange={(e) => onUpdate({ ...widget, height: Math.max(10, parseInt(e.target.value) || 10) })} className={inputCls} />
          )}
        </div>

        {field('Value Range',
          <div className="grid grid-cols-2 gap-2">
            <input type="number" value={widget.min} onChange={(e) => onUpdate({ ...widget, min: parseFloat(e.target.value) })} placeholder="Min" className={inputCls} />
            <input type="number" value={widget.max} onChange={(e) => onUpdate({ ...widget, max: parseFloat(e.target.value) })} placeholder="Max" className={inputCls} />
          </div>
        )}

        {field('BG Color',
          <input type="color" value={(widget.style.backgroundColor as string) || '#1a1a2e'} onChange={(e) => onUpdate({ ...widget, style: { ...widget.style, backgroundColor: e.target.value } })} className="w-full h-8 rounded cursor-pointer border border-gray-600" />
        )}

        {field('Border Radius',
          <input type="range" min="0" max="24" value={parseInt((widget.style.borderRadius as string) || '0')} onChange={(e) => onUpdate({ ...widget, style: { ...widget.style, borderRadius: `${e.target.value}px` } })} className="w-full accent-blue-500" />
        )}
      </div>
    </div>
  );
}