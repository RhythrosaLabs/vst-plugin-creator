import React, { useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { Plugin } from '../../types/plugin';

interface PreviewProps {
  plugin: Plugin;
}

export default function Preview({ plugin }: PreviewProps) {
  const audioContextRef = useRef<Tone.Context | null>(null);

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new Tone.Context();
      Tone.setContext(audioContextRef.current);
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.dispose();
      }
    };
  }, []);

  const handleTestSound = async () => {
    await Tone.start();
    if (plugin.type === 'instrument') {
      const synth = new Tone.Synth().toDestination();
      synth.triggerAttackRelease("C4", "8n");
    } else {
      const osc = new Tone.Oscillator().start();
      const effect = new Tone.FeedbackDelay("8n", 0.5).toDestination();
      osc.connect(effect);
      osc.stop("+1");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Preview</h3>
      <div className="space-y-4">
        <button
          onClick={handleTestSound}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Sound
        </button>
        <div className="p-4 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">
            Note: This is a simplified preview. The actual VST plugin may sound different
            in your DAW.
          </p>
        </div>
      </div>
    </div>
  );
}