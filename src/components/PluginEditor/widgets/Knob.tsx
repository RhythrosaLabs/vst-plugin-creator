import React from 'react';
import { Widget } from '../../../types/widget';

interface KnobProps {
  widget: Widget;
  onUpdate: (widget: Widget) => void;
}

export default function Knob({ widget, onUpdate }: KnobProps) {
  const rotation = ((widget.value - widget.min) / (widget.max - widget.min)) * 270 - 135;
  const size = Math.min(widget.width, widget.height);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const startY = e.clientY;
    const startValue = widget.value;

    const handleMouseMove = (ev: MouseEvent) => {
      const deltaY = startY - ev.clientY;
      const deltaValue = (deltaY / 100) * (widget.max - widget.min);
      const newValue = Math.min(widget.max, Math.max(widget.min, startValue + deltaValue));
      onUpdate({ ...widget, value: newValue });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-1">
      <div
        className="rounded-full bg-gray-700 border-2 border-gray-600 relative cursor-ns-resize select-none"
        style={{ width: size * 0.75, height: size * 0.75 }}
        onMouseDown={handleMouseDown}
      >
        {/* Track arc bg */}
        <svg
          viewBox="0 0 40 40"
          className="absolute inset-0 w-full h-full"
        >
          <circle cx="20" cy="20" r="14" fill="none" stroke="#374151" strokeWidth="3" strokeDasharray="66 100" strokeLinecap="round" transform="rotate(135 20 20)" />
          <circle
            cx="20" cy="20" r="14"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeDasharray={`${((widget.value - widget.min) / (widget.max - widget.min)) * 66} 100`}
            strokeLinecap="round"
            transform="rotate(135 20 20)"
          />
        </svg>
        {/* Indicator dot */}
        <div
          className="absolute w-1.5 h-1.5 bg-white rounded-full"
          style={{
            left: '50%',
            top: '15%',
            marginLeft: '-3px',
            transformOrigin: '3px 850%',
            transform: `rotate(${rotation}deg)`,
          }}
        />
      </div>
      <span className="text-xs text-gray-400 text-center leading-tight truncate w-full text-center">{widget.label}</span>
    </div>
  );
}