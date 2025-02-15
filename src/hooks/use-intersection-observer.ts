import { useEffect, useState, RefObject } from "react";

export function useIntersectionObserver(
  ref: RefObject<Element>,
  options: IntersectionObserverInit = {
    threshold: 0,
    root: null,
    rootMargin: "0px",
  },
): boolean {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const element = ref?.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
}
