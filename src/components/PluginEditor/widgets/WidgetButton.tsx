import React from 'react';
import { WidgetType } from '../../../types/widget';

interface WidgetButtonProps {
  type: WidgetType;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export function WidgetButton({ icon, label, onClick }: WidgetButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 p-3 hover:bg-gray-100 rounded-lg transition-colors"
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}