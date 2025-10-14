import { useRef, useEffect } from "react";

// Expanded random character pool — includes ASCII, symbols, and thin spaces
const RANDOM_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" +
  "!@#$%^&*()-_=+[]{};:,.<>/?\\|" +
  "░▒▓█▄▀" +  // block elements
  "·•°"; // dots

const randomChar = () =>
  RANDOM_CHARS.charAt((Math.random() * RANDOM_CHARS.length) | 0);

function generateSmoothRandom(prev, length) {
  // Reuse ~30% of prior characters for smoother transitions
  let result = "";
  const reuseProb = 0.3;
  for (let i = 0; i < length; i++) {
    result += prev && prev[i] && Math.random() < reuseProb
      ? prev[i]
      : randomChar();
  }
  return result;
}

export default function ScrambleHover({
  initial = "",
  final = "",
  className = "",
  durationIn = 900,
  durationOut = 700,
  direction = "ltr", // "ltr" | "rtl" | "center"
}) {
  const spanRef = useRef(null);
  const rafRef = useRef(null);
  const textCache = useRef(initial);

  // Set initial text & cleanup on unmount
  useEffect(() => {
    const el = spanRef.current;
    if (el) el.textContent = initial;
    textCache.current = initial;
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [initial]);

  // Cubic ease-in-out (fast & branchless)
  const ease = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - ((-2 * t + 2) ** 3) / 2);

  function scrambleTo(target, duration) {
    const el = spanRef.current;
    if (!el) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const start = performance.now();
    const from = textCache.current;
    const fromLen = from.length;
    const toLen = target.length;
    let prevRandom = "";

    const animate = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = ease(progress);

      const currentLength = Math.round(fromLen + (toLen - fromLen) * eased);
      const revealCount = Math.floor(eased * toLen);

      // Compute revealed section
      let revealed = "";
      if (direction === "rtl") {
        revealed = target.slice(toLen - revealCount);
      } else if (direction === "center") {
        const half = Math.floor(revealCount / 2);
        revealed = target.slice(0, half) + target.slice(toLen - (revealCount - half));
      } else {
        revealed = target.slice(0, revealCount);
      }

      const fillerLen = Math.max(0, currentLength - revealCount);
      const randomPart = generateSmoothRandom(prevRandom, fillerLen);
      prevRandom = randomPart;

      let output = "";
      switch (direction) {
        case "rtl":
          output = randomPart + revealed;
          break;
        case "center": {
          const split = Math.ceil(revealed.length / 2);
          output = revealed.slice(0, split) + randomPart + revealed.slice(split);
          break;
        }
        default:
          output = revealed + randomPart;
      }

      if (output !== textCache.current) {
        el.textContent = output;
        textCache.current = output;
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        el.textContent = target;
        textCache.current = target;
      }
    };

    // Prevent flicker — schedule first frame so we don't synchronously write
    // the full target text from inside scrambleTo and cause a one-frame flash.
    // Sync cached text with the DOM before starting.
    if (el.textContent !== from) {
      el.textContent = from;
      textCache.current = from;
    }

    rafRef.current = requestAnimationFrame(animate);
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
      tabIndex={0}
    >
      {initial}
    </span>
  );
}