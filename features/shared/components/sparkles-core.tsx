import styles from "./sparkles-core.module.css";

type SparklesCoreProps = {
  particleColor?: string;
  particleDensity?: number;
  maxSize?: number;
  minSize?: number;
  speed?: number;
};

export function SparklesCore({
  particleColor = "#FFFFFF",
  particleDensity = 520,
  maxSize = 1.2,
  minSize = 0.4,
  speed = 0.8,
}: SparklesCoreProps) {
  const count = Math.min(200, Math.max(0, Math.round(particleDensity / 10)));

  return (
    <div aria-hidden="true" className={styles.field}>
      {Array.from({ length: count }, (_, index) => {
        // Deterministic variation keeps the server and client markup identical.
        const variation = ((index * 37 + 11) % 101) / 100;
        const size = minSize + (maxSize - minSize) * variation;
        const duration = (2 + variation * 3) / Math.max(speed, 0.1);

        return (
          <span
            key={index}
            className={styles.particle}
            style={{
              left: `${(index * 61 + 7) % 100}%`,
              top: `${(index * 43 + 19) % 100}%`,
              width: size,
              height: size,
              backgroundColor: particleColor,
              boxShadow: `0 0 3px ${particleColor}`,
              animationDuration: `${duration}s`,
              animationDelay: `${-variation * duration}s`,
            }}
          />
        );
      })}
    </div>
  );
}
