import React from 'react';
import { Widget } from '../../../types/widget';

interface DisplayProps {
  widget: Widget;
}

export default function Display({ widget }: DisplayProps) {
  return (
    <div className="w-full h-full bg-gray-900 border border-gray-700 rounded-lg p-2 flex flex-col items-center justify-center">
      <span className="text-green-400 font-mono text-sm tabular-nums">
        {widget.value.toFixed(2)}
      </span>
      <span className="text-gray-500 text-xs mt-1 truncate w-full text-center">{widget.label}</span>
    </div>
  );
}