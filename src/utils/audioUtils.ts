export function createAudioContext(): AudioContext {
  return new (window.AudioContext || (window as any).webkitAudioContext)();
}

export function connectNodes(source: AudioNode, ...nodes: AudioNode[]): void {
  nodes.reduce((prev, curr) => {
    prev.connect(curr);
    return curr;
  }, source);
}

export function disconnectNodes(source: AudioNode, ...nodes: AudioNode[]): void {
  nodes.forEach(node => {
    try {
      node.disconnect();
    } catch (e) {
      console.warn('Error disconnecting node:', e);
    }
  });
}

export function createGainNode(context: AudioContext, gain = 1): GainNode {
  const node = context.createGain();
  node.gain.value = gain;
  return node;
}

export function createOscillator(
  context: AudioContext,
  type: OscillatorType = 'sine',
  frequency = 440
): OscillatorNode {
  const oscillator = context.createOscillator();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  return oscillator;
}