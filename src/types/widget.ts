import { CSSProperties } from 'react';

export type WidgetType = 'knob' | 'fader' | 'button' | 'display' | 'label' | 'meter' | 'oscilloscope' | 'spectrum';

export interface Widget {
  id: string;
  type: WidgetType;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  value: number;
  min: number;
  max: number;
  defaultValue: number;
  style: CSSProperties;
  parameterId?: string;
}