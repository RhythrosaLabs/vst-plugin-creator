import React from 'react';
import { Parameter, ParameterCategory } from '../../../types/parameter';
import { ParameterControl } from './ParameterControl';
import { parameterCategories } from '../../../data/parameterCategories';
import { Plus, ChevronDown } from 'lucide-react';

interface ParameterListProps {
  parameters: Parameter[];
  onUpdateParameter: (parameterId: string, value: number) => void;
  onAddParameter: () => void;
  onRemoveParameter: (parameterId: string) => void;
}

export function ParameterList({
  parameters,
  onUpdateParameter,
  onAddParameter,
  onRemoveParameter
}: ParameterListProps) {
  const [expandedCategories, setExpandedCategories] = React.useState<ParameterCategory[]>(['input']);

  const parametersByCategory = React.useMemo(() => {
    return parameters.reduce((acc, param) => {
      if (!acc[param.category]) {
        acc[param.category] = [];
      }
      acc[param.category].push(param);
      return acc;
    }, {} as Record<ParameterCategory, Parameter[]>);
  }, [parameters]);

  const toggleCategory = (category: ParameterCategory) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Parameters</h3>
        <button
          onClick={onAddParameter}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2">
        {Object.entries(parameterCategories).map(([category, info]) => (
          <div key={category} className="border rounded-lg overflow-hidden">
            <button
              className="w-full px-4 py-3 flex items-center justify-between bg-gray-50"
              onClick={() => toggleCategory(category as ParameterCategory)}
            >
              <span className="font-medium">{info.name}</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  expandedCategories.includes(category as ParameterCategory)
                    ? 'transform rotate-180'
                    : ''
                }`}
              />
            </button>

            {expandedCategories.includes(category as ParameterCategory) && (
              <div className="p-4 space-y-4">
                {parametersByCategory[category as ParameterCategory]?.map(param => (
                  <ParameterControl
                    key={param.id}
                    parameter={param}
                    onChange={value => onUpdateParameter(param.id, value)}
                    onRemove={() => onRemoveParameter(param.id)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}