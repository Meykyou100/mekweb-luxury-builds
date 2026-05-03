import { useEffect } from "react";

export const useScrollReveal = () => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observedElements = new Set<HTMLElement>();

    const prepareElement = (element: HTMLElement) => {
      const delay = Number(element.dataset.revealDelay ?? 0);
      element.style.setProperty("--reveal-delay", `${Number.isFinite(delay) ? delay : 0}ms`);
    };

    const revealElement = (element: HTMLElement) => {
      prepareElement(element);
      element.classList.add("is-visible");
    };

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      const revealAll = () => {
        document.querySelectorAll<HTMLElement>("[data-reveal]").forEach(revealElement);
      };

      revealAll();
      const mutationObserver = new MutationObserver(revealAll);
      mutationObserver.observe(document.body, { childList: true, subtree: true });

      return () => mutationObserver.disconnect();
    }

    const observeRevealElements = () => {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
        if (observedElements.has(element) || element.classList.contains("is-visible")) return;

        prepareElement(element);
        observedElements.add(element);
        observer.observe(element);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const target = entry.target as HTMLElement;
          target.classList.add("is-visible");
          observedElements.delete(target);
          observer.unobserve(target);
        });
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.08,
      },
    );

    const mutationObserver = new MutationObserver(observeRevealElements);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    observeRevealElements();

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
      observedElements.clear();
    };
  }, []);
};
