"use client";

import { useEffect, useRef, useState } from "react";

const START = 9;

export function ContinuePrompt() {
  const [count, setCount] = useState(START);
  const [active, setActive] = useState(false);
  const promptRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const prompt = promptRef.current;
    if (!prompt) return;

    const observer = new IntersectionObserver(([entry]) => {
      setActive(entry.isIntersecting);
      if (!entry.isIntersecting) setCount(START);
    });
    observer.observe(prompt);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active || count === 0) return;

    const timer = window.setInterval(() => {
      setCount((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [active, count]);

  return (
    <span ref={promptRef} className={count === 0 ? "blink" : undefined}>
      {count === 0 ? (
        "INSERT COIN"
      ) : (
        <>
          CONTINUE?
          <span className="ml-[0.5em] inline-block">{count}</span>
        </>
      )}
    </span>
  );
}
