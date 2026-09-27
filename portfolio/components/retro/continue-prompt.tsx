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

    // A press restarts the count only once it is off screen.
    let pressed = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && pressed) {
        pressed = false;
        setCount(START);
      }
      setActive(entry.isIntersecting);
    });
    observer.observe(prompt);
    const link = prompt.closest("a");
    const restart = () => {
      pressed = true;
    };
    link?.addEventListener("click", restart);

    return () => {
      observer.disconnect();
      link?.removeEventListener("click", restart);
    };
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
