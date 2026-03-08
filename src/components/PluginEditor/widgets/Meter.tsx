import React from 'react';
import { Widget } from '../../../types/widget';

interface MeterProps {
  widget: Widget;
}

export default function Meter({ widget }: MeterProps) {
  const pct = ((widget.value - widget.min) / (widget.max - widget.min)) * 100;
  const type = widget.type;

  if (type === 'oscilloscope') {
    // Simple sine wave SVG preview
    const pts = Array.from({ length: 60 }, (_, i) => {
      const x = (i / 59) * widget.width;
      const y = (widget.height / 2) * (1 - Math.sin((i / 59) * Math.PI * 4) * 0.8);
      return `${x},${y}`;
    }).join(' ');
    return (
      <svg width="100%" height="100%" className="bg-gray-900 rounded">
        <polyline points={pts} fill="none" stroke="#00ff88" strokeWidth="1.5" />
      </svg>
    );
  }

  if (type === 'spectrum') {
    const bars = Array.from({ length: 20 }, (_, i) => {
      const h = (Math.random() * 0.6 + 0.1) * widget.height;
      const x = (i / 20) * widget.width;
      const w = (widget.width / 20) * 0.7;
      return { x, w, h };
    });
    return (
      <svg width="100%" height="100%" className="bg-gray-900 rounded">
        {bars.map((b, i) => (
          <rect
            key={i}
            x={b.x}
            y={widget.height - b.h}
            width={b.w}
            height={b.h}
            fill={`hsl(${120 + i * 6}, 80%, 50%)`}
          />
        ))}
      </svg>
    );
  }

  // Default: VU Meter
  return (
    <div className="flex flex-col items-center justify-end w-full h-full bg-gray-900 rounded p-1 gap-1">
      <div className="flex-1 w-4 bg-gray-700 rounded relative overflow-hidden">
        <div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-500 via-yellow-400 to-red-500 transition-all duration-100"
          style={{ height: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-green-400 font-mono">{widget.value.toFixed(1)}</span>
    </div>
  );
}
