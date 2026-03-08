import { Parameter, ParameterType, ParameterCategory } from '../types/parameter';
import { createParameter } from './parameterDefaults';

// Common parameter templates
const gainParameter = (name = 'Gain') => 
  createParameter('gain', 'input', name, {
    min: -60,
    max: 12,
    defaultValue: 0,
    unit: 'dB'
  });

const frequencyParameter = (name: string, defaultValue = 1000) =>
  createParameter('frequency', 'filter', name, {
    min: 20,
    max: 20000,
    defaultValue,
    unit: 'Hz',
    curve: 'logarithmic'
  });

const qParameter = (name = 'Q') =>
  createParameter('q', 'filter', name, {
    min: 0.1,
    max: 10,
    defaultValue: 1,
    curve: 'logarithmic'
  });

const timeParameter = (name: string, max = 1000, defaultValue = 100) =>
  createParameter('time', 'time', name, {
    min: 0,
    max,
    defaultValue,
    unit: 'ms',
    curve: 'logarithmic'
  });

export const effectParameters = {
  filter: {
    lowpass: [
      frequencyParameter('Cutoff'),
      qParameter('Resonance'),
      createParameter('percentage', 'filter', 'Drive', {
        min: 0,
        max: 100,
        defaultValue: 0,
        unit: '%'
      })
    ],
    highpass: [
      frequencyParameter('Cutoff', 80),
      qParameter('Resonance'),
      createParameter('percentage', 'filter', 'Slope', {
        min: 0,
        max: 100,
        defaultValue: 50,
        unit: '%'
      })
    ],
    bandpass: [
      frequencyParameter('Center Freq'),
      qParameter('Bandwidth'),
      createParameter('percentage', 'filter', 'Gain', {
        min: -12,
        max: 12,
        defaultValue: 0,
        unit: 'dB'
      })
    ]
  },
  
  dynamics: {
    compressor: [
      createParameter('gain', 'dynamics', 'Threshold', {
        min: -60,
        max: 0,
        defaultValue: -20,
        unit: 'dB'
      }),
      createParameter('ratio', 'dynamics', 'Ratio', {
        min: 1,
        max: 20,
        defaultValue: 4,
        unit: ':1',
        curve: 'exponential'
      }),
      timeParameter('Attack', 100, 10),
      timeParameter('Release', 1000, 100),
      createParameter('gain', 'dynamics', 'Knee', {
        min: 0,
        max: 24,
        defaultValue: 6,
        unit: 'dB'
      }),
      gainParameter('Makeup')
    ],
    
    limiter: [
      createParameter('gain', 'dynamics', 'Threshold', {
        min: -30,
        max: 0,
        defaultValue: -0.1,
        unit: 'dB'
      }),
      timeParameter('Release', 500, 50),
      createParameter('gain', 'dynamics', 'Ceiling', {
        min: -30,
        max: 0,
        defaultValue: 0,
        unit: 'dB'
      })
    ]
  },

  modulation: {
    chorus: [
      createParameter('time', 'modulation', 'Rate', {
        min: 0.1,
        max: 10,
        defaultValue: 1,
        unit: 'Hz',
        curve: 'logarithmic'
      }),
      createParameter('percentage', 'modulation', 'Depth', {
        min: 0,
        max: 100,
        defaultValue: 50,
        unit: '%'
      }),
      createParameter('percentage', 'modulation', 'Mix', {
        min: 0,
        max: 100,
        defaultValue: 50,
        unit: '%'
      }),
      createParameter('percentage', 'modulation', 'Spread', {
        min: 0,
        max: 100,
        defaultValue: 50,
        unit: '%'
      })
    ],

    flanger: [
      createParameter('time', 'modulation', 'Rate', {
        min: 0.1,
        max: 10,
        defaultValue: 0.5,
        unit: 'Hz'
      }),
      createParameter('time', 'modulation', 'Delay', {
        min: 1,
        max: 20,
        defaultValue: 5,
        unit: 'ms'
      }),
      createParameter('percentage', 'modulation', 'Depth', {
        min: 0,
        max: 100,
        defaultValue: 50,
        unit: '%'
      }),
      createParameter('percentage', 'modulation', 'Feedback', {
        min: 0,
        max: 100,
        defaultValue: 50,
        unit: '%'
      })
    ],

    phaser: [
      createParameter('time', 'modulation', 'Rate', {
        min: 0.1,
        max: 10,
        defaultValue: 1,
        unit: 'Hz'
      }),
      createParameter('percentage', 'modulation', 'Depth', {
        min: 0,
        max: 100,
        defaultValue: 50,
        unit: '%'
      }),
      createParameter('percentage', 'modulation', 'Feedback', {
        min: 0,
        max: 100,
        defaultValue: 50,
        unit: '%'
      }),
      createParameter('enum', 'modulation', 'Stages', {
        min: 2,
        max: 12,
        defaultValue: 4,
        step: 2
      })
    ]
  },

  reverb: {
    plate: [
      timeParameter('Pre-Delay', 200, 0),
      createParameter('time', 'time', 'Decay', {
        min: 0.1,
        max: 10,
        defaultValue: 2,
        unit: 's',
        curve: 'logarithmic'
      }),
      createParameter('percentage', 'modulation', 'Damping', {
        min: 0,
        max: 100,
        defaultValue: 50,
        unit: '%'
      }),
      createParameter('percentage', 'modulation', 'Size', {
        min: 0,
        max: 100,
        defaultValue: 50,
        unit: '%'
      }),
      createParameter('percentage', 'modulation', 'Width', {
        min: 0,
        max: 100,
        defaultValue: 100,
        unit: '%'
      }),
      createParameter('percentage', 'modulation', 'Mix', {
        min: 0,
        max: 100,
        defaultValue: 30,
        unit: '%'
      })
    ]
  },

  delay: {
    stereo: [
      timeParameter('Time L', 2000, 250),
      timeParameter('Time R', 2000, 375),
      createParameter('percentage', 'time', 'Feedback', {
        min: 0,
        max: 100,
        defaultValue: 50,
        unit: '%'
      }),
      createParameter('percentage', 'time', 'Cross', {
        min: 0,
        max: 100,
        defaultValue: 0,
        unit: '%'
      }),
      frequencyParameter('Low Cut', 80),
      frequencyParameter('High Cut', 12000),
      createParameter('percentage', 'time', 'Mix', {
        min: 0,
        max: 100,
        defaultValue: 50,
        unit: '%'
      })
    ]
  },

  distortion: {
    tube: [
      createParameter('percentage', 'dynamics', 'Drive', {
        min: 0,
        max: 100,
        defaultValue: 50,
        unit: '%'
      }),
      createParameter('percentage', 'dynamics', 'Bias', {
        min: 0,
        max: 100,
        defaultValue: 50,
        unit: '%'
      }),
      createParameter('enum', 'dynamics', 'Character', {
        min: 0,
        max: 3,
        defaultValue: 0,
        enumValues: ['Clean', 'Warm', 'Hot', 'Extreme']
      }),
      frequencyParameter('Tone', 5000),
      gainParameter('Output')
    ],
    
    bitcrusher: [
      createParameter('enum', 'dynamics', 'Bit Depth', {
        min: 1,
        max: 16,
        defaultValue: 8,
        step: 1
      }),
      createParameter('frequency', 'dynamics', 'Sample Rate', {
        min: 100,
        max: 44100,
        defaultValue: 44100,
        unit: 'Hz',
        curve: 'logarithmic'
      }),
      createParameter('percentage', 'dynamics', 'Jitter', {
        min: 0,
        max: 100,
        defaultValue: 0,
        unit: '%'
      }),
      createParameter('percentage', 'dynamics', 'Mix', {
        min: 0,
        max: 100,
        defaultValue: 100,
        unit: '%'
      })
    ]
  }
};

export function getEffectParameters(effectType: string, subType: string): Parameter[] {
  return effectParameters[effectType]?.[subType] || [];
}