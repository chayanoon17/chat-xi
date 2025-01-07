// components/Particles.tsx
'use client';

import { useEffect } from 'react';

const Particles: React.FC = () => {
  useEffect(() => {
    const particleContainer = document.querySelector('.boxes');

    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * window.innerWidth + 'px';
      particle.style.top = Math.random() * window.innerHeight + 'px';
      particle.style.animationDuration = Math.random() * 5 + 2 + 's';
      particleContainer?.appendChild(particle);

      particle.addEventListener('animationend', () => {
        particle.remove();
      });
    };

    const spawnParticles = () => {
      setInterval(createParticle, 1000);
    };

    spawnParticles();

    // Cleanup on unmount
    return () => {
      if (particleContainer) {
        particleContainer.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="boxes fixed top-0 left-0 w-full h-full pointer-events-none">
    </div>
  );
};

export default Particles;
