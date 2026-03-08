import { Plugin } from '../types/plugin';
import { createParameter } from './parameterDefaults';

export const templates: Record<string, Plugin> = {
  'empty-effect': {
    id: 'template-empty',
    name: 'Empty Effect',
    type: 'effect',
    parameters: [],
    code: {
      cpp: `void processBlock(float** buffer, int numChannels, int numSamples) {
  for (int channel = 0; channel < numChannels; ++channel) {
    float* data = buffer[channel];
    for (int sample = 0; sample < numSamples; ++sample) {
      data[sample] = data[sample]; // pass-through
    }
  }
}`,
      header: `#pragma once
#include <cmath>

class AudioProcessor {
public:
  void processBlock(float** buffer, int numChannels, int numSamples);
};`
    },
    metadata: {
      manufacturer: 'VST Plugin Creator',
      version: '1.0.0',
      category: 'Effect',
      description: 'An empty audio effect plugin — start from scratch',
      uniqueId: 'com.vstplugin.empty'
    },
    interface: { width: 600, height: 400, backgroundColor: '#1a1a2e', widgets: [] }
  },
  'compressor': {
    id: 'template-compressor',
    name: 'Compressor',
    type: 'effect',
    parameters: [
      createParameter('gain', 'dynamics', 'Threshold', { min: -60, max: 0, defaultValue: -20, unit: 'dB' }),
      createParameter('ratio', 'dynamics', 'Ratio', { min: 1, max: 20, defaultValue: 4, unit: ':1', curve: 'exponential' }),
      createParameter('time', 'dynamics', 'Attack', { min: 0.1, max: 100, defaultValue: 10, unit: 'ms', curve: 'logarithmic' }),
      createParameter('time', 'dynamics', 'Release', { min: 10, max: 1000, defaultValue: 100, unit: 'ms', curve: 'logarithmic' }),
      createParameter('gain', 'dynamics', 'Makeup Gain', { min: 0, max: 24, defaultValue: 0, unit: 'dB' }),
    ],
    code: {
      cpp: `void Compressor::processBlock(float** buffer, int nCh, int nSamples) {
  for (int ch = 0; ch < nCh; ++ch) {
    float* data = buffer[ch];
    for (int s = 0; s < nSamples; ++s) {
      float inputDb = 20.0f * log10f(fabsf(data[s]) + 1e-6f);
      float gainRed = 0.0f;
      if (inputDb > threshold)
        gainRed = -(inputDb - threshold) * (1.0f - 1.0f / ratio);
      envelope += (gainRed - envelope) *
        (gainRed > envelope ? attackCoef : releaseCoef);
      data[s] *= powf(10.0f, (envelope + makeupGain) / 20.0f);
    }
  }
}`,
      header: `#pragma once
#include <cmath>

class Compressor {
public:
  float threshold  = -20.0f;
  float ratio      = 4.0f;
  float attackCoef = 0.001f;
  float releaseCoef = 0.1f;
  float makeupGain = 0.0f;
  float envelope   = 0.0f;

  void processBlock(float** buffer, int numChannels, int numSamples);
};`
    },
    metadata: {
      manufacturer: 'VST Plugin Creator',
      version: '1.0.0',
      category: 'Dynamics',
      description: 'A professional dynamic range compressor',
      uniqueId: 'com.vstplugin.compressor'
    },
    interface: { width: 600, height: 400, backgroundColor: '#1a1a2e', widgets: [] }
  },
  'delay': {
    id: 'template-delay',
    name: 'Stereo Delay',
    type: 'effect',
    parameters: [
      createParameter('time', 'time', 'Time L', { min: 1, max: 2000, defaultValue: 250, unit: 'ms', curve: 'logarithmic' }),
      createParameter('time', 'time', 'Time R', { min: 1, max: 2000, defaultValue: 375, unit: 'ms', curve: 'logarithmic' }),
      createParameter('percentage', 'time', 'Feedback', { min: 0, max: 95, defaultValue: 50, unit: '%' }),
      createParameter('percentage', 'time', 'Mix', { min: 0, max: 100, defaultValue: 50, unit: '%' }),
    ],
    code: {
      cpp: `void StereoDelay::processBlock(float** buf, int numCh, int numSamples) {
  for (int s = 0; s < numSamples; ++s) {
    for (int ch = 0; ch < numCh; ++ch) {
      int rp = (writePos - (int)(delayMs[ch] * sampleRate / 1000.0f) + BUF_SIZE) % BUF_SIZE;
      float d = delayBuf[ch][rp];
      delayBuf[ch][writePos] = buf[ch][s] + d * feedback;
      buf[ch][s] = buf[ch][s] * (1.0f - mix) + d * mix;
    }
    writePos = (writePos + 1) % BUF_SIZE;
  }
}`,
      header: `#pragma once
static const int BUF_SIZE = 192000;

class StereoDelay {
public:
  float delayMs[2]  = {250.0f, 375.0f};
  float feedback    = 0.5f;
  float mix         = 0.5f;
  float sampleRate  = 44100.0f;
  float delayBuf[2][BUF_SIZE] = {};
  int   writePos    = 0;

  void processBlock(float** buffer, int numChannels, int numSamples);
};`
    },
    metadata: {
      manufacturer: 'VST Plugin Creator',
      version: '1.0.0',
      category: 'Delay',
      description: 'A stereo delay with independent L/R times',
      uniqueId: 'com.vstplugin.stereodelay'
    },
    interface: { width: 600, height: 400, backgroundColor: '#0d1b2a', widgets: [] }
  },
  'chorus': {
    id: 'template-chorus',
    name: 'Chorus',
    type: 'effect',
    parameters: [
      createParameter('time', 'modulation', 'Rate', { min: 0.1, max: 10, defaultValue: 1, unit: 'Hz', curve: 'logarithmic' }),
      createParameter('percentage', 'modulation', 'Depth', { min: 0, max: 100, defaultValue: 50, unit: '%' }),
      createParameter('percentage', 'modulation', 'Mix', { min: 0, max: 100, defaultValue: 50, unit: '%' }),
    ],
    code: {
      cpp: `void Chorus::processBlock(float** buf, int numCh, int numSamples) {
  for (int s = 0; s < numSamples; ++s) {
    lfoPhase += rate / sampleRate;
    if (lfoPhase >= 1.0f) lfoPhase -= 1.0f;
    float mod = baseDelay + sinf(lfoPhase * 6.283185f) * depth * 0.001f * sampleRate;
    for (int ch = 0; ch < numCh; ++ch) {
      int rp = (writePos - (int)mod + CBUF) % CBUF;
      float d = cbuf[ch][rp];
      cbuf[ch][writePos] = buf[ch][s];
      buf[ch][s] = buf[ch][s] * (1.0f - mix) + d * mix;
    }
    writePos = (writePos + 1) % CBUF;
  }
}`,
      header: `#pragma once
#include <cmath>
static const int CBUF = 48000;

class Chorus {
public:
  float rate       = 1.0f;
  float depth      = 0.5f;
  float mix        = 0.5f;
  float sampleRate = 44100.0f;
  float baseDelay  = 0.02f * 44100.0f;
  float lfoPhase   = 0.0f;
  float cbuf[2][CBUF] = {};
  int   writePos   = 0;

  void processBlock(float** buffer, int numChannels, int numSamples);
};`
    },
    metadata: {
      manufacturer: 'VST Plugin Creator',
      version: '1.0.0',
      category: 'Modulation',
      description: 'A lush stereo chorus effect',
      uniqueId: 'com.vstplugin.chorus'
    },
    interface: { width: 600, height: 400, backgroundColor: '#16213e', widgets: [] }
  },
  'empty-instrument': {
    id: 'template-instrument',
    name: 'Simple Synth',
    type: 'instrument',
    parameters: [
      createParameter('frequency', 'filter', 'Filter Cutoff', { defaultValue: 5000 }),
      createParameter('q', 'filter', 'Resonance', { defaultValue: 1 }),
      createParameter('time', 'time', 'Attack', { min: 1, max: 2000, defaultValue: 10, unit: 'ms' }),
      createParameter('time', 'time', 'Decay', { min: 1, max: 2000, defaultValue: 100, unit: 'ms' }),
      createParameter('percentage', 'time', 'Sustain', { min: 0, max: 100, defaultValue: 70, unit: '%' }),
      createParameter('time', 'time', 'Release', { min: 1, max: 5000, defaultValue: 300, unit: 'ms' }),
      createParameter('gain', 'output', 'Volume', { min: -60, max: 6, defaultValue: 0, unit: 'dB' }),
    ],
    code: {
      cpp: `void SimpleSynth::processBlock(float** buf, int numCh, int numSamples) {
  for (int s = 0; s < numSamples; ++s) {
    float out = 0.0f;
    for (auto& v : voices) {
      if (!v.active) continue;
      out += sinf(v.phase * 6.283185f) * v.amp * v.env;
      v.phase += v.freq / sampleRate;
      if (v.phase >= 1.0f) v.phase -= 1.0f;
    }
    for (int ch = 0; ch < numCh; ++ch) buf[ch][s] = out;
  }
}`,
      header: `#pragma once
#include <cmath>
#include <vector>

struct Voice {
  bool  active = false;
  float freq   = 440.0f;
  float amp    = 0.5f;
  float phase  = 0.0f;
  float env    = 0.0f;
};

class SimpleSynth {
public:
  float sampleRate = 44100.0f;
  float attackMs   = 10.0f;
  float decayMs    = 100.0f;
  float sustainPct = 0.7f;
  float releaseMs  = 300.0f;
  std::vector<Voice> voices;

  void processBlock(float** buffer, int numChannels, int numSamples);
};`
    },
    metadata: {
      manufacturer: 'VST Plugin Creator',
      version: '1.0.0',
      category: 'Instrument',
      description: 'A basic sine-wave synthesizer with ADSR envelope',
      uniqueId: 'com.vstplugin.simplesynth'
    },
    interface: { width: 700, height: 450, backgroundColor: '#0f0e17', widgets: [] }
  }
};
