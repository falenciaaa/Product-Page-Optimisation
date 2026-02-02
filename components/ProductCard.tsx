'use client';

import { Product } from '../types/products';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: Props) {
  return (
    <Link 
      href={`/product/${product.id}`}
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
          flexDirection: 'column'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          paddingTop: '100%',
          background: '#e8e8e8',
          overflow: 'hidden'
        }}>
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            loading="lazy"
          />
        </div>

        <div style={{ 
          padding: '16px',
          background: '#ffffff',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '2px'
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
            flex: 1,
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            {product.description}
          </p>

          <div style={{ 
            fontSize: '20px', 
            fontWeight: 700,
            color: '#1a1a1a',
            marginTop: '4px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            ${product.price.toFixed(0)}
          </div>
        </div>
      </div>
    </Link>
  );
}