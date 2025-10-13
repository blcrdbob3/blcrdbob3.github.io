import { useRef, useEffect } from 'react';

const RANDOM_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:,.<>/?\\|";

function randomChar() {
  return RANDOM_CHARS.charAt(Math.floor(Math.random() * RANDOM_CHARS.length));
}

export default function ScrambleHover({ initial = '', final = '', className = '' }) {
  const spanRef = useRef(null);
  const rafRef = useRef(null);
  const initialRef = useRef(initial);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  function startScramble() {
    const el = spanRef.current;
    if (!el) return;
    const target = final;
    const start = performance.now();
    const duration = 900; // ms

    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const reveal = Math.floor(t * target.length);
      let out = '';
      for (let i = 0; i < target.length; i++) {
        if (i < reveal) out += target[i];
        else out += randomChar();
      }
      el.textContent = out;
      if (t < 1) rafRef.current = requestAnimationFrame(frame);
      else el.textContent = target;
    }

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(frame);
  }

  function stopScramble() {
    const el = spanRef.current;
    if (!el) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    // Animate back to the initial text
    const target = initialRef.current;
    const start = performance.now();
    const duration = 700;

    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const reveal = Math.floor(t * target.length);
      let out = '';
      for (let i = 0; i < target.length; i++) {
        if (i < reveal) out += target[i];
        else out += randomChar();
      }
      el.textContent = out;
      if (t < 1) rafRef.current = requestAnimationFrame(frame);
      else el.textContent = target;
    }

    rafRef.current = requestAnimationFrame(frame);
  }

  return (
    <span
      ref={spanRef}
      className={className}
      onMouseEnter={startScramble}
      onMouseLeave={stopScramble}
      onFocus={startScramble}
      onBlur={stopScramble}
      tabIndex={0}
    >
      {initial}
    </span>
  );
}
