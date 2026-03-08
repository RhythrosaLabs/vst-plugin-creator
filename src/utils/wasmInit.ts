import { WasmFs } from '@wasmer/wasmfs';
import { WASI } from '@wasmer/wasi';

let wasmFs: WasmFs | null = null;
let wasi: WASI | null = null;

export function getWasmFs(): WasmFs {
  if (!wasmFs) {
    wasmFs = new WasmFs();
    setupVirtualFileSystem(wasmFs);
  }
  return wasmFs;
}

export function getWASI(): WASI {
  if (!wasi) {
    const fs = getWasmFs();
    wasi = new WASI({
      args: [],
      env: {},
      bindings: {
        ...WASI.defaultBindings,
        fs: fs.fs
      }
    });
  }
  return wasi;
}

function setupVirtualFileSystem(fs: WasmFs) {
  // Create necessary directories
  fs.mkdirSync('/include', { recursive: true });
  fs.mkdirSync('/include/vst3sdk', { recursive: true });
  fs.mkdirSync('/include/vst3sdk/base', { recursive: true });
  fs.mkdirSync('/include/vst3sdk/pluginterfaces', { recursive: true });
  fs.mkdirSync('/include/vst3sdk/public.sdk', { recursive: true });

  // Write mock header files
  fs.writeFileSync('/include/vst3sdk/base/source/fstring.h', '');
  fs.writeFileSync('/include/vst3sdk/pluginterfaces/base/funknown.h', '');
  fs.writeFileSync('/include/vst3sdk/public.sdk/source/main/pluginfactory.h', '');
}

export async function initializeWasm(): Promise<void> {
  getWasmFs();
  getWASI();
}