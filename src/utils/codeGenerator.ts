import { Plugin } from '../types/plugin';
import { Parameter } from '../types/parameter';

function generateParameterCode(parameters: Parameter[]): string {
  return parameters.map((param, index) => `
    float ${param.name.replace(/\s+/g, '_')} = parameters[${index}];
    // Apply parameter curve and range
    ${param.name.replace(/\s+/g, '_')} = ${
      param.curve === 'exponential' 
        ? `pow(${param.name.replace(/\s+/g, '_')}, 2.0f)`
        : param.curve === 'logarithmic'
        ? `exp(${param.name.replace(/\s+/g, '_')} * log(20000.0f/20.0f) + log(20.0f))`
        : param.name.replace(/\s+/g, '_')
    };
    ${param.name.replace(/\s+/g, '_')} = ${param.name.replace(/\s+/g, '_')} * (${param.max} - ${param.min}) + ${param.min};
  `).join('\n');
}

export function generateVstCode(plugin: Plugin) {
  const headerCode = `
#pragma once
#include "public.sdk/source/vst/vstaudioeffect.h"
#include "pluginterfaces/vst/ivstparameterchanges.h"

namespace ${plugin.name.replace(/\s+/g, '_')} {

class AudioEffect : public Steinberg::Vst::AudioEffect {
public:
    AudioEffect();
    virtual ~AudioEffect();
    
    static Steinberg::FUnknown* createInstance(void*) { 
        return (Steinberg::Vst::IAudioProcessor*)new AudioEffect(); 
    }

    virtual Steinberg::tresult PLUGIN_API process(Steinberg::Vst::ProcessData& data) override;
    virtual Steinberg::tresult PLUGIN_API initialize() override;
    virtual Steinberg::tresult PLUGIN_API terminate() override;

private:
    // Parameter values
    ${plugin.parameters.map(p => `float ${p.name.replace(/\s+/g, '_')};`).join('\n    ')}
};

}`;

  const sourceCode = `
#include "${plugin.name}.h"
#include <cmath>

namespace ${plugin.name.replace(/\s+/g, '_')} {

AudioEffect::AudioEffect() {
    setControllerClass(kControllerCid);
    ${plugin.parameters.map(p => 
      `${p.name.replace(/\s+/g, '_')} = ${p.defaultValue};`
    ).join('\n    ')}
}

AudioEffect::~AudioEffect() {}

Steinberg::tresult PLUGIN_API AudioEffect::initialize() {
    return Steinberg::kResultOk;
}

Steinberg::tresult PLUGIN_API AudioEffect::terminate() {
    return Steinberg::kResultOk;
}

Steinberg::tresult PLUGIN_API AudioEffect::process(Steinberg::Vst::ProcessData& data) {
    if (data.numSamples <= 0) return Steinberg::kResultOk;

    // Get parameters
    ${generateParameterCode(plugin.parameters)}

    // Process audio
    ${plugin.code.cpp}

    return Steinberg::kResultOk;
}

}`;

  const factoryCode = `
#include "public.sdk/source/main/pluginfactory.h"
#include "${plugin.name}.h"

bool InitModule() { return true; }
bool DeinitModule() { return true; }

using namespace Steinberg::Vst;

DEF_CLASS2(INLINE_UID_FROM_FUID(${plugin.metadata.uniqueId}),
          PClassInfo::kManyInstances,
          kVstAudioEffectClass,
          "${plugin.name}",
          Vst::kDistributable,
          "${plugin.metadata.category}",
          FULL_VERSION_STR,
          kVstVersionString,
          ${plugin.name.replace(/\s+/g, '_')}::AudioEffect::createInstance)`;

  return {
    headerCode,
    sourceCode,
    factoryCode
  };
}