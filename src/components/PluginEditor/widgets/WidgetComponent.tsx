import React, { useRef, useCallback } from 'react';
import { Widget } from '../../../types/widget';
import Knob from './Knob';
import Fader from './Fader';
import Button from './Button';
import Display from './Display';
import Meter from './Meter';

interface WidgetComponentProps {
  widget: Widget;
  selected: boolean;
  onSelect: () => void;
  onDrag: (id: string, x: number, y: number) => void;
  onUpdate: (widget: Widget) => void;
  containerRef?: React.RefObject<HTMLDivElement>;
}

export default function WidgetComponent({
  widget,
  selected,
  onSelect,
  onDrag,
  onUpdate,
  containerRef,
}: WidgetComponentProps) {
  const dragStart = useRef<{ mouseX: number; mouseY: number; widgetX: number; widgetY: number } | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      widgetX: widget.x,
      widgetY: widget.y,
    };

    const handleMouseMove = (ev: MouseEvent) => {
      if (!dragStart.current) return;
      const containerRect = containerRef?.current?.getBoundingClientRect();
      const dx = ev.clientX - dragStart.current.mouseX;
      const dy = ev.clientY - dragStart.current.mouseY;
      let newX = dragStart.current.widgetX + dx;
      let newY = dragStart.current.widgetY + dy;
      if (containerRect) {
        newX = Math.max(0, Math.min(newX, containerRect.width - widget.width));
        newY = Math.max(0, Math.min(newY, containerRect.height - widget.height));
      }
      onDrag(widget.id, newX, newY);
    };

    const handleMouseUp = () => {
      dragStart.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [widget, onSelect, onDrag, containerRef]);

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
      case 'meter':
      case 'oscilloscope':
      case 'spectrum':
        return <Meter widget={widget} />;
      case 'label':
        return (
          <div className="flex items-center justify-center w-full h-full">
            <span className="text-sm font-medium" style={{ color: widget.style.color as string || '#fff' }}>{widget.label}</span>
          </div>
        );
      default:
        return <div className="text-xs text-center p-1">{widget.label}</div>;
    }
  };

  return (
    <div
      className={`absolute cursor-move select-none ${selected ? 'ring-2 ring-blue-400 ring-offset-1' : ''}`}
      style={{
        left: widget.x,
        top: widget.y,
        width: widget.width,
        height: widget.height,
        ...widget.style,
      }}
      onMouseDown={handleMouseDown}
    >
      {renderWidget()}
    </div>
  );
}