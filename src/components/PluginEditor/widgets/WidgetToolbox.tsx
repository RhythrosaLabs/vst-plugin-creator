import React from 'react';
import { RotateCw, SlidersHorizontal, ToggleLeft, Monitor, Type, Activity, Volume2, BarChart2 } from 'lucide-react';
import { WidgetType } from '../../../types/widget';

interface WidgetToolboxProps {
  onAddWidget: (type: WidgetType) => void;
}

const widgets: { type: WidgetType; icon: React.ElementType; label: string }[] = [
  { type: 'knob',        icon: RotateCw,         label: 'Knob' },
  { type: 'fader',       icon: SlidersHorizontal, label: 'Fader' },
  { type: 'button',      icon: ToggleLeft,        label: 'Button' },
  { type: 'display',     icon: Monitor,           label: 'Display' },
  { type: 'label',       icon: Type,              label: 'Label' },
  { type: 'meter',       icon: Activity,          label: 'VU Meter' },
  { type: 'oscilloscope',icon: BarChart2,         label: 'Scope' },
  { type: 'spectrum',    icon: Volume2,           label: 'Spectrum' },
];

export default function WidgetToolbox({ onAddWidget }: WidgetToolboxProps) {
  return (
    <div className="w-36 bg-gray-800 rounded-xl border border-gray-700 p-3 flex-shrink-0">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Widgets</h3>
      <div className="grid grid-cols-2 gap-1.5">
        {widgets.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => onAddWidget(type)}
            className="flex flex-col items-center gap-1 p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
            title={`Add ${label}`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs leading-none">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}