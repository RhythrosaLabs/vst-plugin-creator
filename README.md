# 🎛️ VST Plugin Creator

> **A browser-based visual builder for VST3 audio plugins** — design your plugin interface, add parameters, write DSP code, and export ready-to-compile C++ source files in seconds.

![VST Plugin Creator Screenshot](docs/screenshot-main.png)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎨 **Visual Interface Designer** | Drag-and-drop canvas — place knobs, faders, buttons, displays, VU meters, oscilloscope and spectrum widgets |
| 🎛️ **Parameter System** | Add gain, frequency, Q, time, ratio, percentage, toggle and enum parameters with logarithmic/exponential curves and full range control |
| 💻 **Monaco Code Editor** | Full C++ syntax highlighting for your DSP source and header files |
| 📦 **5 Starter Templates** | Empty Effect, Compressor, Stereo Delay, Chorus, and Simple Synth |
| 🔧 **Plugin Metadata** | Set manufacturer, version, category, description and unique plugin ID |
| 💾 **Auto-save to localStorage** | Projects persist in the browser between sessions |
| ⬇️ **Export Source Bundle** | Downloads `.h`, `.cpp`, `CMakeLists.txt`, `README.md` and `plugin.json` — ready to drop into a JUCE project |
| 🌑 **Dark Theme** | Sleek dark UI optimised for long audio engineering sessions |

---

## 🚀 Quick Start

### Online

> Coming soon — [vst-plugin-creator.vercel.app](#)

### Local Dev

```bash
git clone https://github.com/yourusername/vst-plugin-creator
cd vst-plugin-creator
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🎬 Usage

### 1. Create a Plugin

Click **+ Create Plugin** and choose a template:

- **Empty Effect** — blank canvas, write everything from scratch
- **Compressor** — pre-wired with threshold, ratio, attack, release, makeup gain
- **Stereo Delay** — independent L/R delay times, feedback and mix
- **Chorus** — LFO-driven modulation delay
- **Simple Synth** — basic monophonic sine-wave VCO with ADSR

### 2. Design the Interface

Switch to the **Interface** tab:

1. Pick a widget from the toolbox (left panel)
2. Drag it anywhere on the canvas
3. Select a widget to edit its properties (right panel):
   - **Label** — displayed name
   - **Link to Parameter** — bind the widget to a plugin parameter
   - **Size** (W × H)
   - **Value Range** (min / max)
   - **Background color** and **border radius**
4. Change canvas background color and dimensions with the controls above

### 3. Add Parameters

Switch to the **Parameters** tab and click **Add** to pick from 13 presets:

| Preset | Type | Default Range |
|---|---|---|
| Gain | dB | −60 → +12 dB |
| Filter Cutoff | Hz | 20 → 20 000 Hz (log) |
| Filter Q | — | 0.1 → 10 (log) |
| Threshold | dB | −60 → 0 dB |
| Ratio | :1 | 1 → 20 (exp) |
| Attack | ms | 0.1 → 100 ms |
| Release | ms | 0.01 → 1 000 ms |
| Mix / Dry-Wet | % | 0 → 100 % |
| LFO Rate | Hz | 0.01 → 20 Hz |
| Depth | % | 0 → 100 % |
| Delay Time | ms | 1 → 2 000 ms |
| Feedback | % | 0 → 95 % |
| Toggle On/Off | — | 0 / 1 |

Parameters are grouped by category (Input, Filter, Dynamics, Modulation, Time, Output) and displayed as interactive sliders.

### 4. Edit DSP Code

Switch to the **Code** tab to edit:

- **Source (.cpp)** — your `processBlock` implementation
- **Header (.h)** — class declaration and member variables

The editor uses Monaco (the same engine as VS Code) with full C++ syntax highlighting, auto-indent and multi-cursor support.

### 5. Update Metadata

Switch to the **Settings** tab to configure:

- Manufacturer name, version, category, description
- Unique plugin ID (reverse-DNS format: `com.yourco.pluginname`)
- Plugin type (Effect vs. Instrument)

### 6. Export

Click **Export** in the top-right header. Five files download automatically:

```
YourPlugin.h            ← C++ header (class declaration)
YourPlugin.cpp          ← C++ source (processBlock + factory)
CMakeLists.txt          ← CMake build file for JUCE
README.md               ← Auto-generated plugin README
YourPlugin.plugin.json  ← Full plugin manifest (reimport-ready)
```

---

## 🏗️ Building the Exported Plugin

### Prerequisites

- [JUCE](https://juce.com) 7.x
- CMake 3.22+
- C++17 compiler (Clang 14+, GCC 12+, or MSVC 2022)
- macOS 12+ / Windows 10+ / Ubuntu 22+

### Steps

```bash
# Clone your exported source into a new folder
mkdir MyPlugin && cd MyPlugin
# Copy YourPlugin.h, YourPlugin.cpp, CMakeLists.txt here

# Point CMake at your JUCE installation
cmake -B build -DJUCE_DIR=/path/to/JUCE
cmake --build build --config Release

# Plugin appears in:
#   macOS:   build/MyPlugin_artefacts/Release/VST3/MyPlugin.vst3
#   Windows: build/MyPlugin_artefacts/Release/VST3/MyPlugin.vst3
#   Linux:   build/MyPlugin_artefacts/Release/VST3/MyPlugin.vst3
```

---

## 🧩 Widget Reference

| Widget | Icon | Description |
|---|---|---|
| **Knob** | 🎛️ | SVG arc knob — drag vertically to change value |
| **Fader** | 📊 | Vertical linear fader with thumb |
| **Button** | 🔘 | Toggle button (on/off) |
| **Display** | 🖥️ | Numeric value readout |
| **Label** | 🏷️ | Static text label |
| **VU Meter** | 📶 | Level meter (green → yellow → red) |
| **Scope** | 〰️ | Oscilloscope waveform preview |
| **Spectrum** | 🎵 | Frequency spectrum bars preview |

---

## 🗂️ Project Structure

```
src/
├── App.tsx                        # Root component, localStorage persistence
├── types/
│   ├── plugin.ts                  # Plugin, PluginMetadata, PluginInterface
│   ├── parameter.ts               # Parameter with type/category/curve
│   └── widget.ts                  # Widget types (knob, fader, etc.)
├── components/
│   ├── PluginList/                # Sidebar plugin browser
│   └── PluginEditor/
│       ├── PluginEditor.tsx       # Tabbed editor (Interface/Params/Code/Settings)
│       ├── InterfaceEditor.tsx    # Drag-and-drop canvas
│       ├── ParameterList.tsx      # Parameter list + add preset menu
│       ├── widgets/               # Knob, Fader, Button, Display, Meter widgets
│       └── CodeEditor/            # Monaco C++ editor
├── data/
│   ├── pluginTemplates.ts         # 5 built-in templates with real C++ DSP code
│   ├── parameterCategories.ts     # Category metadata + icons
│   ├── parameterDefaults.ts       # createParameter() factory
│   └── parameterTemplates.ts      # Preset parameter banks (filter, dynamics, …)
├── hooks/
│   ├── usePluginState.ts          # Plugin state management hook
│   └── usePluginTemplate.ts       # Template instantiation hook
└── utils/
    ├── codeGenerator.ts           # Generates VST3-style C++ header + source
    ├── exportPlugin.ts            # Downloads .h/.cpp/CMake/README/JSON bundle
    ├── parameterUtils.ts          # Normalize / denormalize / curve helpers
    └── idGenerator.ts             # Unique ID generator
```

---

## 🛠️ Tech Stack

| Library | Version | Purpose |
|---|---|---|
| [React](https://react.dev) | 18.3 | UI framework |
| [TypeScript](https://typescriptlang.org) | 5.5 | Type safety |
| [Vite](https://vitejs.dev) | 5.4 | Build tool + HMR |
| [Tailwind CSS](https://tailwindcss.com) | 3.4 | Utility-first CSS |
| [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react) | 4.6 | C++ code editor |
| [Lucide React](https://lucide.dev) | 0.344 | Icon library |
| [@dnd-kit](https://dndkit.com) | 6.x | Accessible drag-and-drop |

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit with conventional commits: `git commit -m "feat: add reverb template"`
4. Push and open a Pull Request

### Ideas for Contributions

- [ ] More DSP templates (reverb, distortion, EQ, pitch shifter)
- [ ] MIDI mapping for parameters
- [ ] Real-time audio preview using Web Audio API
- [ ] Plugin project import from `.plugin.json`
- [ ] Export as JUCE Projucer `.jucer` project
- [ ] Screenshot/export UI as SVG
- [ ] Undo/redo history

---

## 📄 License

[MIT](LICENSE) © 2025

---

## 🙏 Acknowledgements

- [JUCE Framework](https://juce.com) — the industry-standard C++ framework for VST3 plugins
- [Steinberg VST3 SDK](https://steinbergmedia.github.io/vst3_doc/) — VST3 specification
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) — code editing engine
