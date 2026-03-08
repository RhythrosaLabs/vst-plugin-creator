import React from 'react';
import { Parameter } from '../../../types/parameter';
import { Trash2 } from 'lucide-react';
import { normalizeParameterValue, denormalizeParameterValue } from '../../../utils/parameterUtils';

interface ParameterControlProps {
  parameter: Parameter;
  onChange: (value: number) => void;
  onRemove: () => void;
}

export function ParameterControl({ parameter, onChange, onRemove }: ParameterControlProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const normalized = parseFloat(e.target.value);
    const value = denormalizeParameterValue(normalized, parameter);
    onChange(value);
  };

  const normalizedValue = normalizeParameterValue(parameter.value, parameter);
  const displayValue = parameter.value.toFixed(2);

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium text-gray-700">
            {parameter.name}
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {displayValue} {parameter.unit}
            </span>
            <button
              onClick={onRemove}
              className="p-1 hover:bg-gray-100 rounded text-gray-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.001"
          value={normalizedValue}
          onChange={handleChange}
          className="w-full"
        />
      </div>
    </div>
  );
}