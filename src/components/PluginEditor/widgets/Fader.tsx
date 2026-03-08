import React from 'react';
import { Widget } from '../../../types/widget';

interface FaderProps {
  widget: Widget;
  onUpdate: (widget: Widget) => void;
}

export default function Fader({ widget, onUpdate }: FaderProps) {
  const pct = (widget.value - widget.min) / (widget.max - widget.min);
  const trackH = widget.height - 32;
  const thumbTop = trackH * (1 - pct);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const track = e.currentTarget.querySelector('[data-track]') as HTMLDivElement;
    if (!track) return;
    const rect = track.getBoundingClientRect();

    const calc = (clientY: number) => {
      const raw = 1 - (clientY - rect.top) / rect.height;
      const clamped = Math.max(0, Math.min(1, raw));
      return widget.min + clamped * (widget.max - widget.min);
    };

    onUpdate({ ...widget, value: calc(e.clientY) });

    const onMove = (ev: MouseEvent) => onUpdate({ ...widget, value: calc(ev.clientY) });
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  return (
    <div className="flex flex-col items-center justify-between w-full h-full py-1">
      <div
        data-track
        className="flex-1 relative w-4 cursor-pointer"
        onMouseDown={handleMouseDown}
      >
        <div data-track className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Track */}
          <div className="absolute inset-y-0 w-1.5 bg-gray-700 rounded-full left-1/2 -translate-x-1/2" />
          {/* Fill */}
          <div
            className="absolute bottom-0 w-1.5 bg-blue-500 rounded-full left-1/2 -translate-x-1/2"
            style={{ height: `${pct * 100}%` }}
          />
          {/* Thumb */}
          <div
            className="absolute w-4 h-2 bg-white rounded-sm shadow border border-gray-400 left-1/2 -translate-x-1/2"
            style={{ top: `${thumbTop}px` }}
          />
        </div>
      </div>
      <span className="text-xs text-gray-400 mt-1 truncate w-full text-center">{widget.label}</span>
    </div>
  );
}