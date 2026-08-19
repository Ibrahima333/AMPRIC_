import { useEffect, useRef, useState } from "react";

const STATS = [
  { label: "Personnes aidées", value: 600, suffix: "+" },
  { label: "Familles accompagnées", value: 30, suffix: "+" },
  { label: "Actions de sensibilisation", value: 65, suffix: "" },
  { label: "Années d'engagement", value: 1, suffix: "" },
];

function useCountUp(target, active, duration = 1600) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return undefined;

    let frame;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);

  return value;
}

function StatCard({ label, value, suffix, delay }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  const count = useCountUp(value, active);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`impact-stat-card reveal ${active ? "is-visible" : ""}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      <strong className="impact-stat-number">
        {count.toLocaleString("fr-FR")}
        {suffix}
      </strong>
      <span className="impact-stat-label">{label}</span>
    </div>
  );
}

export default function StatsCounter() {
  return (
    <div className="impact-stats-section container-fluid">
      <div className="impact-stats-grid">
        {STATS.map((stat, i) => (
          <StatCard key={stat.label} {...stat} delay={i * 100} />
        ))}
      </div>
    </div>
  );
}
