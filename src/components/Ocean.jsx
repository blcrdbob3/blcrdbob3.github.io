// src/components/Ocean.jsx
import { useEffect, useRef } from "react";
import "../styles/ocean.css";

export default function Ocean({ length = 400 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Pre-generate stable randomness to prevent flicker
    const noise = Array.from({ length: length * 100 }, () => Math.random());

    let offset = 0;
    let rafId;
    let lastFrame = 0;
    let timeElapsed = 0; // track elapsed time for speed oscillation

    const draw = (time) => {
      // Limit frame rate to ~30 fps for smoother performance
      if (time - lastFrame < 33) {
        rafId = requestAnimationFrame(draw);
        return;
      }

      const deltaTime = time - lastFrame;
      lastFrame = time;
      timeElapsed += deltaTime * 0.001; // convert ms to seconds

      // Dynamically compute container height
      const container = el.parentElement;
      const h = container?.getBoundingClientRect().height || window.innerHeight * 0.2;

      const computed = window.getComputedStyle(el);
      const lineHeight = parseFloat(computed.lineHeight) || 14;
      const rows = Math.ceil(h / lineHeight);
      const cols = length;

      let text = "";

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const waveHeight = Math.sin((x + offset) / 8) * 2 + 2;
          const surfaceY = Math.floor(waveHeight);
          const i = (y * length + x + Math.floor(offset)) % noise.length;
          const n = noise[i];

          if (y === surfaceY) {
            // Outline: only '#' and spaces
            text += n < 0.15 ? " " : "#";
          } else if (y > surfaceY) {
            // Below the surface: dots and some spaces
            text += n < 0.85 ? "." : " ";
          } else {
            // Above: empty air
            text += " ";
          }
        }
        if (y < rows - 1) text += "\n";
      }

      el.textContent = text;

      // Variable wave speed — oscillates smoothly between 0.4 and 0.5
      const waveSpeed = 0.45 + Math.sin(timeElapsed * 0.8) * 0.05;
      offset += waveSpeed;

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [length]);

  return <pre ref={ref} className="ocean-terminal" aria-hidden="true" />;
}