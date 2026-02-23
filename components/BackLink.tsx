'use client';

import Link from 'next/link';

export default function BackLink() {
  return (
    <Link 
      href="/" 
      style={{ 
        color: 'var(--accent)', 
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: 500,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        marginBottom: '48px',
        transition: 'opacity 0.2s'
      }}
      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
    >
      <span>←</span> Back to Products
    </Link>
  );
}