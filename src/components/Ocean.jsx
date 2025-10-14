// src/components/Ocean.jsx
import { useEffect, useRef } from "react";
import "../styles/ocean.css";

export default function Ocean({ length = 400 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const NOISE_SIZE = length * 100;
    const baseNoise = new Float32Array(NOISE_SIZE).map(() => Math.random());

    let offset = 0;
    let rafId;
    let lastFrame = 0;
    let timeElapsed = 0;
    let glitchPhase = 0;
    let prevHeights = new Float32Array(length).fill(0);

    const lerp = (a, b, t) => a + (b - a) * t;

    function mutateNoise(globalPhase) {
      const baseIntensity = 0.001 + Math.sin(globalPhase * 0.1) * 0.001;
      for (let i = 0; i < NOISE_SIZE; i++) {
        const xPhase = (i % length) / length;
        const phaseMod = (Math.sin(globalPhase * 0.4 + xPhase * Math.PI * 2) + 1) * 0.5;
        const prob = baseIntensity * (0.3 + phaseMod);
        if (Math.random() < prob) baseNoise[i] = Math.random();
      }
    }

    const draw = (time) => {
      if (time - lastFrame < 33) {
        rafId = requestAnimationFrame(draw);
        return;
      }

      const delta = time - lastFrame;
      lastFrame = time;
      timeElapsed += delta * 0.001;

      // Mutate noise occasionally to avoid static look
      if (timeElapsed % 0.6 < 0.033) mutateNoise(glitchPhase);
      glitchPhase += delta * 0.002;

      const container = el.parentElement;
      const h = container?.getBoundingClientRect().height || window.innerHeight * 0.2;
      const computed = window.getComputedStyle(el);
      const lineHeight = parseFloat(computed.lineHeight) || 14;
      const rows = Math.ceil(h / lineHeight);
      const cols = length;

      let text = "";

      // Compute smooth wave heights per column
      const waveHeights = new Float32Array(cols);
      for (let x = 0; x < cols; x++) {
        const base =
          Math.sin((x + offset) / 8) * 2 +
          Math.sin((x + offset) / 17) * 1.5 +
          2.5;
        waveHeights[x] = lerp(prevHeights[x], base, 0.15); // smoother transitions
      }
      prevHeights = waveHeights;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const surfaceY = Math.round(waveHeights[x]);
          const i = (y * length + x + Math.floor(offset)) % baseNoise.length;
          const n = baseNoise[i];

          if (y === surfaceY) {
            // stable single outline
            text += "#";
          } else if (y > surfaceY) {
            // below surface: dampen noise near the top to reduce shimmer
            const depth = y - surfaceY;
            const noiseFactor = depth < 2 ? 0.93 : 0.85; // smoother near top
            text += n < noiseFactor ? "." : " ";
          } else {
            // above surface: air
            text += " ";
          }
        }
        if (y < rows - 1) text += "\n";
      }

      el.textContent = text;

      // Smooth oscillating horizontal movement
      const waveSpeed = 0.45 + Math.sin(timeElapsed * 0.8) * 0.05;
      offset = lerp(offset, offset + waveSpeed, 0.8); // slightly smoothed offset shift

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [length]);

  return <pre ref={ref} className="ocean-terminal" aria-hidden="true" />;
}