import { useRef, useEffect } from "react";

// Balanced character pool (fast to render, good visual diversity)
const RANDOM_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" +
  "!@#$%^&*()-_=+[]{};:,.<>/?\\|" +
  "░▒▓█▄▀·•°";

const randomChar = () =>
  RANDOM_CHARS.charAt((Math.random() * RANDOM_CHARS.length) | 0);

const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t ** 3 : 1 - Math.pow(-2 * t + 2, 3) / 2;

export default function ScrambleHover({
  initial = "",
  final = "",
  className = "",
  durationIn = 750,
  durationOut = 600,
}) {
  const spanRef = useRef(null);
  const rafRef = useRef(null);
  const currentText = useRef(initial);

  useEffect(() => {
    const el = spanRef.current;
    if (el) el.textContent = initial;
    currentText.current = initial;
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [initial]);

  function scrambleTo(target, duration) {
    const el = spanRef.current;
    if (!el) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const from = currentText.current;
    const fromLen = from.length;
    const toLen = target.length;
    const maxLen = Math.max(fromLen, toLen);
    const startTime = performance.now();
    const randCache = new Array(maxLen).fill("");

    const animate = (ts) => {
      const elapsed = ts - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = easeInOutCubic(t);

      // Faster left-to-right progression
      const visibleCount = Math.round(fromLen + (toLen - fromLen) * eased);
      let out = "";

      for (let i = 0; i < visibleCount; i++) {
        const revealProgress = i / visibleCount;
        const threshold = eased - revealProgress * 0.5;

        const targetChar = target[i] ?? "";
        const fromChar = from[i] ?? "";

        if (threshold >= 1 && targetChar) out += targetChar;
        else if (threshold <= 0 && fromChar) out += fromChar;
        else {
          const reuse = randCache[i] && Math.random() < 0.3;
          const c = reuse ? randCache[i] : randomChar();
          randCache[i] = c;
          out += c;
        }
      }

      if (out !== currentText.current) {
        el.textContent = out;
        currentText.current = out;

        const scale = 0.9 + 0.1 * (visibleCount / maxLen);
        el.style.transform = `scale(${scale})`;
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        el.textContent = target;
        el.style.transform = "scale(1)";
        currentText.current = target;
        rafRef.current = null;
      }
    };

    requestAnimationFrame(animate);
  }

  const handleEnter = () => scrambleTo(final, durationIn);
  const handleLeave = () => scrambleTo(initial, durationOut);

  return (
    <span
      ref={spanRef}
      className={className}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      style={{
        display: "inline-block",
        transition: "transform 0.25s ease",
        willChange: "transform, textContent",
      }}
      tabIndex={0}
    >
      {initial}
    </span>
  );
}