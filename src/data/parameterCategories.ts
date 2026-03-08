import { ParameterCategory } from '../types/parameter';
import { ArrowDownToLine, Scissors, Activity, Box, Clock, Zap, Gauge, Binary, ArrowUpFromLine } from 'lucide-react';

export const parameterCategories: Record<ParameterCategory, {
  name: string;
  icon: typeof ArrowDownToLine;
  description: string;
}> = {
  input: {
    name: 'Input',
    icon: ArrowDownToLine,
    description: 'Input stage parameters'
  },
  filter: {
    name: 'Filters',
    icon: Scissors,
    description: 'Filter and EQ parameters'
  },
  dynamics: {
    name: 'Dynamics',
    icon: Activity,
    description: 'Compression and dynamics parameters'
  },
  modulation: {
    name: 'Modulation',
    icon: Box,
    description: 'Modulation effect parameters'
  },
  time: {
    name: 'Time',
    icon: Clock,
    description: 'Time-based effect parameters'
  },
  output: {
    name: 'Output',
    icon: ArrowUpFromLine,
    description: 'Output stage parameters'
  }
};