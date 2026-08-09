import { useState } from "react";

interface Particle { id: number; left: string; delay: string; duration: string }

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 10}s`,
    duration: `${16 + Math.random() * 10}s`,
  }));
}

/** Fixed full-viewport backdrop: floating gradient blobs + drifting particles. */
export function AnimatedBackground() {
  const [particles] = useState<Particle[]>(() => createParticles(16));

  return (
    <div className="bg-blobs" aria-hidden="true">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration }}
        />
      ))}
    </div>
  );
}
