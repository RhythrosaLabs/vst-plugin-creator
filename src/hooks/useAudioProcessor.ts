import { useRef, useCallback } from 'react';
import { Parameter } from '../types/parameter';
import { AudioProcessor } from '../utils/audioProcessor';

export function useAudioProcessor(parameters: Parameter[]) {
  const processorRef = useRef<AudioProcessor | null>(null);

  const initProcessor = useCallback(() => {
    if (!processorRef.current) {
      processorRef.current = new AudioProcessor(parameters);
    }
  }, [parameters]);

  const updateParameter = useCallback((parameterId: string, value: number) => {
    if (processorRef.current) {
      processorRef.current.updateParameter(parameterId, value);
    }
  }, []);

  const connect = useCallback((source: AudioNode) => {
    if (processorRef.current) {
      processorRef.current.connect(source);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.disconnect();
    }
  }, []);

  return {
    initProcessor,
    updateParameter,
    connect,
    disconnect
  };
}