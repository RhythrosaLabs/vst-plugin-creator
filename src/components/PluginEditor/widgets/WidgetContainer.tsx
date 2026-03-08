import React, { memo } from 'react';
import { Widget } from '../../../types/widget';
import Knob from './Knob';
import Fader from './Fader';
import Button from './Button';
import Display from './Display';

interface WidgetContainerProps {
  widget: Widget;
  selected: boolean;
  onSelect: () => void;
  onUpdate: (widget: Widget) => void;
}

export const WidgetContainer = memo(function WidgetContainer({
  widget,
  selected,
  onSelect,
  onUpdate
}: WidgetContainerProps) {
  const renderWidget = () => {
    switch (widget.type) {
      case 'knob':
        return <Knob widget={widget} onUpdate={onUpdate} />;
      case 'fader':
        return <Fader widget={widget} onUpdate={onUpdate} />;
      case 'button':
        return <Button widget={widget} onUpdate={onUpdate} />;
      case 'display':
        return <Display widget={widget} />;
      default:
        return <div>{widget.label}</div>;
    }
  };

  return (
    <div
      className={`absolute p-2 ${selected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        left: widget.x,
        top: widget.y,
        width: widget.width,
        height: widget.height,
        ...widget.style,
      }}
      onClick={onSelect}
    >
      {renderWidget()}
      <div className="absolute bottom-0 left-0 right-0 text-center text-xs text-gray-600">
        {widget.label}
      </div>
    </div>
  );
});