import { useEffect, useRef, useState } from 'react';

const slides = [
  { title: 'Organize suas ideias', description: 'Com nosso app de anotações' },
  { title: 'Acesse de qualquer lugar', description: 'Sincronização em nuvem' },
  { title: 'Segurança garantida', description: 'Seus dados estão protegidos' },
];

export default function Slider() {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const [startX, setStartX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleStart = (clientX: number) => {
    setStartX(clientX);
    setIsDragging(true);
  };

  const handleEnd = (clientX: number) => {
    if (startX === null) return;

    const diff = clientX - startX;
    const threshold = 50;

    if (diff > threshold && current > 0) {
      setCurrent(current - 1);
    } else if (diff < -threshold && current < slides.length - 1) {
      setCurrent(current + 1);
    }

    setStartX(null);
    setIsDragging(false);
  };

  const onMouseDown = (e: React.MouseEvent) => handleStart(e.clientX);
  const onMouseUp = (e: React.MouseEvent) => handleEnd(e.clientX);
  const onMouseLeave = (e: React.MouseEvent) =>
    isDragging && handleEnd(e.clientX);

  const onTouchStart = (e: React.TouchEvent) =>
    handleStart(e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) =>
    handleEnd(e.changedTouches[0].clientX);

  useEffect(()=> {
    const timer = setTimeout(() => {
      if (current < slides.length - 1) {
        setCurrent(current + 1);
      } else {
        setCurrent(0);
      }
    }, 5000);
    if (isDragging) {
      clearTimeout(timer);
    }
    return () => clearTimeout(timer);
  }, [isDragging])

  return (
    <div
      className="slider-container"
      ref={containerRef}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="slider-track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="slide">
            <h2 className="text-3xl font-bold mb-2">{slide.title}</h2>
            <p className="text-lg">{slide.description}</p>
          </div>
        ))}
      </div>

      <div className="slider-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={` slider-dot ${i === current ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
