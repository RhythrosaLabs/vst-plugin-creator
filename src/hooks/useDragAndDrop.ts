import { useState, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

interface UseDragAndDropProps {
  onDragEnd?: (position: Position) => void;
}

export function useDragAndDrop({ onDragEnd }: UseDragAndDropProps = {}) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }, [position]);

  const handleDragMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;

    const newPosition = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    };

    setPosition(newPosition);
  }, [isDragging, dragStart]);

  const handleDragEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onDragEnd?.(position);
    }
  }, [isDragging, position, onDragEnd]);

  return {
    isDragging,
    position,
    handleDragStart,
    handleDragMove,
    handleDragEnd
  };
}