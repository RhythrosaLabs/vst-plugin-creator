import { Parameter } from '../types/parameter';
import * as Comlink from 'comlink';

class AudioProcessorWorker {
  private parameters: Parameter[] = [];
  private parameterValues: Map<string, number> = new Map();
  private sampleRate: number = 44100;
  private blockSize: number = 128;
  private processingBuffer: Float32Array;

  constructor() {
    this.processingBuffer = new Float32Array(this.blockSize);
  }

  updateParameters(parameters: Parameter[]) {
    this.parameters = parameters;
    parameters.forEach(param => {
      this.parameterValues.set(param.id, param.value);
    });
  }

  processAudioBlock(inputBuffer: Float32Array): Float32Array {
    for (let i = 0; i < inputBuffer.length; i++) {
      let sample = inputBuffer[i];

      // Apply each parameter's processing
      for (const param of this.parameters) {
        const value = this.parameterValues.get(param.id) || param.defaultValue;
        if (param.processingFunction) {
          try {
            const processFn = new Function('input', 'paramValue', param.processingFunction);
            sample = processFn(sample, value);
          } catch (error) {
            console.error(`Error processing parameter ${param.name}:`, error);
          }
        }
      }

      this.processingBuffer[i] = sample;
    }

    return this.processingBuffer;
  }

  updateParameterValue(parameterId: string, value: number) {
    this.parameterValues.set(parameterId, value);
  }
}

Comlink.expose(AudioProcessorWorker);