import { useEffect, useRef, useState } from 'react';

/**
 * useInView - toggles `in-view` when the element intersects the viewport.
 * Options are tuned for gentle reveal animations.
 */
export function useInView<T extends HTMLElement>(options: IntersectionObserverInit = { root: null, rootMargin: '0px', threshold: 0.15 }) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof window === 'undefined' || !(window as any).IntersectionObserver) {
      // Fallback: reveal immediately
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      });
    }, options);

    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return { ref, inView } as const;
}
