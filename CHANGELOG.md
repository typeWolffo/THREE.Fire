# @wolffo/three-fire

## 1.4.0

I gave this library some love.

It had been quietly working for a while, so this release is a proper tune-up:
real bugs squashed, the WebGPU path brought up to date with modern Three.js, and
the whole project hardened so it's genuinely safe to depend on. Nothing here is
breaking — `npm i @wolffo/three-fire@latest` and carry on.

**The crash that had to go.** The WebGPU/TSL React component could blow up with
"Rendered fewer hooks than during the previous render" when the `texture` prop
switched between a URL string and a `Texture` object. Fixed — swap textures
freely now.

**It no longer leaks your GPU.** `Fire` and `FireTSL` gained a `dispose()` method
that frees their geometry and material, and in React Three Fiber it runs
automatically on unmount. Mount and unmount fires all day without watching memory
climb. (Your texture stays yours — it's never disposed for you.)

**WebGPU grew up.** Verified against Three.js r184 and React Three Fiber v9 /
React 19 — while still supporting R3F v8 / React 18 — and the TSL `octaves` prop
finally does something instead of being silently ignored.

**Quieter, lighter, sturdier.** Tests now run against the real Three.js (no more
mocks) and cover the WebGPU code too, linting and coverage gates are wired up, the
published package shed some dead weight, and releases ship with npm provenance.

Full of fixes, empty of breaking changes. Enjoy.

## 1.3.0

- Maintenance release; example and dependency updates.

## 1.2.0

- Restructured the TSL entry points into `tsl/vanilla` and `tsl/react`.

## 1.1.0

- Added WebGPU support via TSL (Three.js Shading Language).

## 1.0.7

- Split entry points into `/vanilla` and `/react` for better tree-shaking.

## 1.0.0

- Initial release: TypeScript volumetric fire effect for Three.js and React
  Three Fiber.
