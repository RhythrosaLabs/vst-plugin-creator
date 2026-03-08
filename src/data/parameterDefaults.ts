import { Parameter, ParameterType, ParameterCategory } from '../types/parameter';
import { generateUniqueId } from '../utils/idGenerator';

export function createParameter(
  type: ParameterType,
  category: ParameterCategory,
  name: string,
  options: Partial<Parameter> = {}
): Parameter {
  const defaults = getParameterDefaults(type);
  
  return {
    id: generateUniqueId(),
    name,
    type,
    category,
    value: options.defaultValue ?? defaults.defaultValue,
    defaultValue: options.defaultValue ?? defaults.defaultValue,
    min: options.min ?? defaults.min,
    max: options.max ?? defaults.max,
    step: options.step ?? defaults.step,
    unit: options.unit ?? defaults.unit,
    curve: options.curve ?? defaults.curve,
    enumValues: options.enumValues,
    smoothing: options.smoothing ?? 0.1,
    automatable: options.automatable ?? true,
    hidden: options.hidden ?? false
  };
}

function getParameterDefaults(type: ParameterType): Partial<Parameter> {
  switch (type) {
    case 'gain':
      return {
        min: -60,
        max: 12,
        defaultValue: 0,
        unit: 'dB',
        curve: 'linear',
        step: 0.1
      };
    case 'frequency':
      return {
        min: 20,
        max: 20000,
        defaultValue: 1000,
        unit: 'Hz',
        curve: 'logarithmic',
        step: 1
      };
    case 'q':
      return {
        min: 0.1,
        max: 10,
        defaultValue: 1,
        curve: 'logarithmic',
        step: 0.1
      };
    case 'time':
      return {
        min: 0,
        max: 5000,
        defaultValue: 100,
        unit: 'ms',
        curve: 'logarithmic',
        step: 1
      };
    case 'ratio':
      return {
        min: 1,
        max: 20,
        defaultValue: 4,
        unit: ':1',
        curve: 'exponential',
        step: 0.1
      };
    case 'percentage':
      return {
        min: 0,
        max: 100,
        defaultValue: 50,
        unit: '%',
        curve: 'linear',
        step: 1
      };
    case 'toggle':
      return {
        min: 0,
        max: 1,
        defaultValue: 0,
        step: 1
      };
    case 'enum':
      return {
        min: 0,
        max: 100,
        defaultValue: 0,
        step: 1
      };
    default:
      return {
        min: 0,
        max: 1,
        defaultValue: 0,
        step: 0.01
      };
  }
}