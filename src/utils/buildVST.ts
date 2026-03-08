import { Plugin } from '../types/plugin';
import { generateVstCode } from './codeGenerator';

export async function buildVST(plugin: Plugin): Promise<Uint8Array> {
  try {
    // Generate VST code
    const { headerCode, sourceCode, factoryCode } = generateVstCode(plugin);
    
    // Create a minimal VST3 bundle structure
    const bundle = new Uint8Array(1024 * 1024); // 1MB buffer
    const encoder = new TextEncoder();
    let offset = 0;

    // VST3 magic bytes
    const magic = encoder.encode('VST3');
    bundle.set(magic, offset);
    offset += magic.length;

    // Plugin metadata
    const metadata = encoder.encode(JSON.stringify({
      name: plugin.name,
      vendor: plugin.metadata.manufacturer,
      version: plugin.metadata.version,
      category: plugin.metadata.category,
      uniqueId: plugin.metadata.uniqueId,
      parameters: plugin.parameters.map(p => ({
        name: p.name,
        defaultValue: p.defaultValue,
        min: p.min,
        max: p.max,
        unit: p.unit
      }))
    }));

    bundle.set(metadata, offset);
    offset += metadata.length;

    // Add code sections
    const codeSection = encoder.encode(JSON.stringify({
      header: headerCode,
      source: sourceCode,
      factory: factoryCode
    }));
    bundle.set(codeSection, offset);
    offset += codeSection.length;

    return bundle.slice(0, offset);
  } catch (error) {
    console.error('VST build failed:', error);
    throw error;
  }
}