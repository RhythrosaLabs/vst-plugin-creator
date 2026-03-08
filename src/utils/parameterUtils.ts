import { Parameter } from '../types/parameter';

export function validateParameterValue(value: number, parameter: Parameter): number {
  return Math.min(Math.max(value, parameter.min), parameter.max);
}

export function normalizeParameterValue(value: number, parameter: Parameter): number {
  return (value - parameter.min) / (parameter.max - parameter.min);
}

export function denormalizeParameterValue(normalizedValue: number, parameter: Parameter): number {
  return parameter.min + normalizedValue * (parameter.max - parameter.min);
}

export function applyParameterCurve(value: number, parameter: Parameter): number {
  switch (parameter.curve) {
    case 'exponential':
      return Math.pow(value, 2);
    case 'logarithmic':
      return Math.log10(value * 9 + 1);
    default:
      return value;
  }
}