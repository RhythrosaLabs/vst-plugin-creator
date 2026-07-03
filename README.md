<div align="center">

# 🎛️ VST Plugin Creator

**A browser-based visual builder for VST3 audio plugins — design interfaces, write DSP code, export ready-to-compile C++**

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![JUCE](https://img.shields.io/badge/JUCE-C++-orange?style=flat)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

</div>

---

VST Plugin Creator is a fully browser-based tool for designing and exporting VST3 audio plugins. Drag-and-drop interface elements onto a canvas, configure parameters, write DSP code in a full Monaco editor, and export a complete C++ source bundle ready to drop into a JUCE project — in seconds.

## ✨ Features

- **Visual Interface Designer** — drag-and-drop canvas with knobs, faders, buttons, VU meters, oscilloscope, and spectrum widgets
- **Parameter System** — gain, frequency, Q, time, ratio, percentage, toggle, and enum params with log/exp curves
- **Monaco Code Editor** — full C++ syntax highlighting for DSP source and header files
- **5 Starter Templates** — Empty Effect, Compressor, Stereo Delay, Chorus, and Simple Synth
- **Plugin Metadata** — set manufacturer, version, category, description, and unique plugin ID
- **Auto-save** — projects persist in localStorage between sessions
- **Export Bundle** — downloads `.h`, `.cpp`, `CMakeLists.txt`, `README.md`, and `plugin.json` ready for JUCE
- **Dark theme** — sleek UI optimized for long audio engineering sessions

## 🚀 Quick Start

```bash
git clone https://github.com/RhythrosaLabs/vst-plugin-creator.git
cd vst-plugin-creator
npm install
npm run dev
```

Then open `http://localhost:5173`, pick a template, design your UI, write your DSP, and click **Export**.

## 🛠️ Tech Stack

- **React + TypeScript** — frontend
- **Vite** — build tool
- **Monaco Editor** — in-browser C++ code editor
- **JUCE** — target framework for exported C++ plugins
- **CMake** — exported build system

## 🤝 Contributing

PRs welcome. Open an issue first for major changes.

## 📄 License

MIT

## 💛 Support

If VST Plugin Creator saved you hours of plugin boilerplate, consider supporting development:

👉 [Donate via PayPal](https://paypal.me/noodlebake) — @noodlebake

---
<div align="center">Made with ❤️ by <a href="https://github.com/RhythrosaLabs">RhythrosaLabs</a></div>
