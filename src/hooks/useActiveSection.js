import { useState, useEffect } from 'react';

export function useActiveSection(sectionIds) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] || '');

  useEffect(() => {
    const observers = [];
    const visibleSections = new Map();

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            visibleSections.set(id, entry.intersectionRatio);
          });

          let maxRatio = 0;
          let maxId = sectionIds[0];
          visibleSections.forEach((ratio, sectionId) => {
            if (ratio > maxRatio) {
              maxRatio = ratio;
              maxId = sectionId;
            }
          });

          if (maxRatio > 0) {
            setActiveSection(maxId);
          }
        },
        {
          threshold: [0, 0.1, 0.2, 0.3, 0.5, 0.7, 1.0],
          rootMargin: '-64px 0px 0px 0px'
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [sectionIds]);

  return activeSection;
}
