export type ParameterType = 
  | 'gain' 
  | 'frequency' 
  | 'q' 
  | 'time' 
  | 'ratio' 
  | 'percentage'
  | 'toggle'
  | 'enum';

export type ParameterCategory =
  | 'input'
  | 'filter'
  | 'dynamics'
  | 'modulation'
  | 'time'
  | 'output';

export interface Parameter {
  id: string;
  name: string;
  type: ParameterType;
  category: ParameterCategory;
  value: number;
  defaultValue: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  curve?: 'linear' | 'exponential' | 'logarithmic';
  enumValues?: string[];
  smoothing?: number;
  automatable?: boolean;
  hidden?: boolean;
}

export interface ParameterGroup {
  id: string;
  name: string;
  category: ParameterCategory;
  parameters: Parameter[];
}