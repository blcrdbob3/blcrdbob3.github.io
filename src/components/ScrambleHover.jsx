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
  // speedMultiplier < 1 => faster, > 1 => slower
  const SPEED_MULTIPLIER = 0.8; // 20% faster
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


    const nowStart = performance.now();
    const from = textCache.current || "";
    const fromLen = from.length;
    const toLen = target.length;
    const maxLen = Math.max(fromLen, toLen);

    // For each character we'll compute a reveal time offset so reveals are
    // staggered across the duration according to direction. For LTR we base
    // timing on the target index so new chars are added left-to-right.
    const charTimes = new Array(maxLen).fill(0).map((_, i) => {
      let pos;
      if (direction === "rtl") {
        pos = maxLen - 1 - i;
      } else if (direction === "center") {
        pos = i; // center handled below
      } else {
        // LTR: base timing on target index to ensure left-to-right growth/shrink
        pos = i;
      }

      if (direction === "center") {
        const mid = (maxLen - 1) / 2;
        return Math.abs(pos - mid) / (mid || 1);
      }
      return pos / (maxLen - 1 || 1);
    });

    // random cache per position for smooth transitions
    const randCache = new Array(maxLen).fill("");

    const animate = (ts) => {
      const elapsed = ts - nowStart;
      const t = Math.min(1, Math.max(0, elapsed / duration));
      const eased = ease(t);

      // Interpolate visible length so characters are progressively added/removed
      const currentLength = Math.round(fromLen + (toLen - fromLen) * eased);
      let out = "";

      for (let i = 0; i < currentLength; i++) {
        // clamp index into charTimes/randCache which were built for maxLen
        const idx = i < charTimes.length ? i : i % charTimes.length;
        const revealProgress = Math.min(1, Math.max(0, (eased - charTimes[idx]) / (1 - charTimes[idx] || 1)));

        const targetChar = i < toLen ? target[i] : "";
        const fromChar = i < fromLen ? from[i] : "";

        if (revealProgress >= 1 && targetChar) {
          out += targetChar;
        } else if (revealProgress <= 0 && fromChar) {
          out += fromChar;
        } else {
          const reuse = Math.random() < 0.35 && randCache[idx];
          const c = reuse || randomChar();
          randCache[idx] = c;
          out += c;
        }
      }

      if (out !== textCache.current) {
        el.textContent = out;
        textCache.current = out;
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // finalize exact target and ensure length matches exactly
        el.textContent = target;
        textCache.current = target;
        rafRef.current = null;
      }
    };

    // Ensure DOM matches cache, then start on next RAF to avoid sync flash
    if (el.textContent !== from) {
      el.textContent = from;
      textCache.current = from;
    }
    rafRef.current = requestAnimationFrame(animate);
  }

  const handleEnter = () => scrambleTo(final, Math.round(durationIn * SPEED_MULTIPLIER));
  const handleLeave = () => scrambleTo(initial, Math.round(durationOut * SPEED_MULTIPLIER));

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