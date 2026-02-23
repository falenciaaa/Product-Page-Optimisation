'use client';

import { Product } from '../types/products';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

interface Props {
  product: Product;
  index: number;
}

interface Sparkle {
  id: number;
  top: string;
  left: string;
  size: number;
  delay: string;
  color: string;
}

const COLORS = ['#ffe066', '#ff6eb4', '#66d9ff', '#b266ff', '#66ffb2'];

function generateSparkles(count: number): Sparkle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    top: `${Math.random() * 90}%`,
    left: `${Math.random() * 90}%`,
    size: Math.floor(Math.random() * 6) + 4,
    delay: `${(Math.random() * 1).toFixed(2)}s`,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));
}

export default function ProductCard({ product, index }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [imageError, setImageError] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isHovered) {
      setSparkles(generateSparkles(6));
      intervalRef.current = setInterval(() => {
        setSparkles(generateSparkles(6));
      }, 1000);
    } else {
      setSparkles([]);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered]);

  return (
    <Link 
      href={`/products/${product.id}`}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
        animation: `scaleIn 0.5s ease-out ${index * 0.03}s both`
      }}
    >
      <div 
        style={{
          background: '#f5f5f5',
          borderRadius: '12px',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
        onMouseEnter={(e) => {
          setIsHovered(true);
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          setIsHovered(false);
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            style={{
              position: 'absolute',
              top: sparkle.top,
              left: sparkle.left,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              background: sparkle.color,
              borderRadius: '50%',
              animation: `glitter 1s ease-in-out infinite`,
              animationDelay: sparkle.delay,
              zIndex: 10,
              pointerEvents: 'none',
            }}
          />
        ))}

        <div style={{ 
          position: 'relative', 
          width: '100%', 
          paddingTop: '100%',
          background: '#e8e8e8',
          overflow: 'hidden',
        }}>
          <Image
            src={imageError ? '/placeholder.svg' : product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            onError={() => setImageError(true)}
            loading="lazy"
            quality={75}
          />
        </div>

        <div style={{ 
          padding: '16px',
          background: '#ffffff',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <h3 style={{ 
            margin: 0,
            fontSize: '15px', 
            lineHeight: '1.2',
            fontWeight: 600,
            color: '#1a1a1a',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '36px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            {product.title}
          </h3>

          <p style={{ 
            margin: 0,
            fontSize: '13px', 
            color: '#666',
            lineHeight: '1.3',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            {product.description}
          </p>

          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'auto'
          }}>
            <div style={{ 
              fontSize: '20px', 
              fontWeight: 700,
              color: '#1a1a1a',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              ${product.price.toFixed(0)}
            </div>
          </div>

          <div style={{ 
            fontSize: '12px', 
            color: '#999',
            marginTop: '4px'
          }}>
            <span style={{ textTransform: 'capitalize' }}>{product.category}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}