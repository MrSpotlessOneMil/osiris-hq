'use client';

import { useEffect, useRef } from 'react';

export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Stars
    const stars: { x: number; y: number; size: number; speed: number; brightness: number }[] = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.1,
        brightness: Math.random(),
      });
    }

    // Nebula colors
    const nebulaGradient = ctx.createRadialGradient(
      canvas.width * 0.7, canvas.height * 0.3, 0,
      canvas.width * 0.7, canvas.height * 0.3, canvas.width * 0.5
    );
    nebulaGradient.addColorStop(0, 'rgba(139, 69, 255, 0.15)');
    nebulaGradient.addColorStop(0.5, 'rgba(75, 0, 130, 0.1)');
    nebulaGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    const nebulaGradient2 = ctx.createRadialGradient(
      canvas.width * 0.2, canvas.height * 0.7, 0,
      canvas.width * 0.2, canvas.height * 0.7, canvas.width * 0.4
    );
    nebulaGradient2.addColorStop(0, 'rgba(255, 100, 50, 0.1)');
    nebulaGradient2.addColorStop(0.5, 'rgba(255, 50, 100, 0.05)');
    nebulaGradient2.addColorStop(1, 'rgba(0, 0, 0, 0)');

    let frame = 0;

    function animate() {
      if (!ctx || !canvas) return;
      frame++;

      // Dark background
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Nebula
      ctx.fillStyle = nebulaGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = nebulaGradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      stars.forEach(star => {
        const twinkle = Math.sin(frame * 0.05 + star.brightness * 10) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + twinkle * 0.7})`;
        ctx.fill();

        // Slow drift
        star.y += star.speed * 0.1;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
}
