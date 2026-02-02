'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Props {
  images: string[];
  title: string;
}

export default function ImageCarousel({ images, title }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div>
      <div style={{ 
        position: 'relative', 
        paddingTop: '100%',
        background: 'var(--bg)',
        borderRadius: '20px',
        overflow: 'hidden',
        marginBottom: '24px',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <Image
          src={images[currentIndex]}
          alt={`${title} - Image ${currentIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          style={{ objectFit: 'cover' }}
          priority
        />

        {images.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.95)',
                color: 'var(--text)',
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontWeight: 600,
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--accent)';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                e.currentTarget.style.color = 'var(--text)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              ←
            </button>

            <button
              onClick={goToNext}
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.95)',
                color: 'var(--text)',
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontWeight: 600,
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--accent)';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                e.currentTarget.style.color = 'var(--text)';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              →
            </button>

            <div style={{
              position: 'absolute',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.9)',
              padding: '8px 12px',
              borderRadius: '100px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)'
            }}>
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    width: idx === currentIndex ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '100px',
                    border: 'none',
                    background: idx === currentIndex ? 'var(--accent)' : 'var(--border)',
                    padding: 0,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
        gap: '12px'
      }}>
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            style={{
              aspectRatio: '1',
              borderRadius: '12px',
              border: idx === currentIndex ? '2.5px solid var(--accent)' : '1px solid var(--border)',
              overflow: 'hidden',
              position: 'relative',
              background: 'var(--bg)',
              padding: 0,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: idx === currentIndex ? 1 : 0.6,
              boxShadow: idx === currentIndex ? 'var(--shadow-sm)' : 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              if (idx !== currentIndex) {
                e.currentTarget.style.opacity = '0.6';
              }
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Image
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              fill
              sizes="90px"
              style={{ objectFit: 'cover' }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}