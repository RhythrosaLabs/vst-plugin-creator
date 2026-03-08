import { Parameter } from '../types/parameter';

export class AudioProcessor {
  private parameters: Parameter[];
  private audioContext: AudioContext;
  private processor: ScriptProcessorNode;
  private parameterValues: Map<string, number>;

  constructor(parameters: Parameter[]) {
    this.parameters = parameters;
    this.parameterValues = new Map();
    this.audioContext = new AudioContext();
    this.processor = this.audioContext.createScriptProcessor(2048, 2, 2);
    
    this.parameters.forEach(param => {
      this.parameterValues.set(param.id, param.value);
    });

    this.processor.onaudioprocess = this.processAudio.bind(this);
  }

  updateParameter(parameterId: string, value: number) {
    this.parameterValues.set(parameterId, value);
  }

  private processAudio(e: AudioProcessingEvent) {
    const inputL = e.inputBuffer.getChannelData(0);
    const inputR = e.inputBuffer.getChannelData(1);
    const outputL = e.outputBuffer.getChannelData(0);
    const outputR = e.outputBuffer.getChannelData(1);

    for (let i = 0; i < inputL.length; i++) {
      let sampleL = inputL[i];
      let sampleR = inputR[i];

      // Apply each parameter's processing
      this.parameters.forEach(param => {
        const value = this.parameterValues.get(param.id) || param.defaultValue;
        if (param.processingFunction) {
          try {
            const processFn = new Function('input', 'paramValue', param.processingFunction);
            sampleL = processFn(sampleL, value);
            sampleR = processFn(sampleR, value);
          } catch (error) {
            console.error(`Error processing parameter ${param.name}:`, error);
          }
        }
      });

      outputL[i] = sampleL;
      outputR[i] = sampleR;
    }
  }

  connect(source: AudioNode) {
    source.connect(this.processor);
    this.processor.connect(this.audioContext.destination);
  }

  disconnect() {
    this.processor.disconnect();
  }
}