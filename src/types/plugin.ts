import { Parameter } from './parameter';
import { Widget } from './widget';

export type PluginType = 'effect' | 'instrument';

export interface Plugin {
  id: string;
  name: string;
  type: PluginType;
  parameters: Parameter[];
  code: {
    cpp: string;
    header: string;
  };
  metadata: PluginMetadata;
  interface: PluginInterface;
}

export interface PluginMetadata {
  manufacturer: string;
  version: string;
  category: string;
  description: string;
  uniqueId: string;
}

export interface PluginInterface {
  width: number;
  height: number;
  backgroundColor: string;
  widgets: Widget[];
}