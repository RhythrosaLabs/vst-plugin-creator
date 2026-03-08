import React from 'react';
import { Widget } from '../../../types/widget';

interface ButtonProps {
  widget: Widget;
  onUpdate: (widget: Widget) => void;
}

export default function Button({ widget, onUpdate }: ButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newValue = widget.value === widget.max ? widget.min : widget.max;
    onUpdate({ ...widget, value: newValue });
  };

  const isActive = widget.value === widget.max;

  return (
    <button
      className={`w-full h-full rounded-lg text-xs font-semibold transition-colors select-none ${
        isActive
          ? 'bg-blue-500 text-white shadow-inner shadow-blue-900'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
      }`}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={handleClick}
    >
      {widget.label}
    </button>
  );
}