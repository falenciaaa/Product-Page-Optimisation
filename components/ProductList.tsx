'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Product } from '../types/products';
import ProductCard from './ProductCard';

interface Props {
  initialProducts: Product[];
  categories: string[];
  pageSize?: number;
}

export default function ProductList({ initialProducts, categories, pageSize = 8 }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const loaderRef = useRef<HTMLDivElement>(null);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...initialProducts];
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }
    result.sort((a, b) =>
      sortOrder === 'asc' ? a.price - b.price : b.price - a.price
    );
    return result;
  }, [initialProducts, selectedCategory, sortOrder]);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [selectedCategory, sortOrder, pageSize]);

  const visibleProducts = filteredAndSortedProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAndSortedProducts.length;

  const loadMore = useCallback(() => {
    setVisibleCount(c => Math.min(c + pageSize, filteredAndSortedProducts.length));
  }, [pageSize, filteredAndSortedProducts.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );
    const el = loaderRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [hasMore, loadMore]);

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Filter bar */}
      <div className="container" style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        alignItems: 'center',
        background: 'var(--surface)',
        padding: '16px 32px',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ flex: 1, minWidth: '160px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{
            fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)',
            textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap',
          }}>Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              flex: 1, padding: '8px 36px 8px 12px',
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: '8px', color: 'var(--text)', fontSize: '14px',
              fontWeight: 500, cursor: 'pointer', appearance: 'none',
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'14\' height=\'8\' viewBox=\'0 0 14 8\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1L7 7L13 1\' stroke=\'%23666666\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")',
              backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
            }}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1, minWidth: '160px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{
            fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)',
            textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap',
          }}>Sort</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            style={{
              flex: 1, padding: '8px 36px 8px 12px',
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: '8px', color: 'var(--text)', fontSize: '14px',
              fontWeight: 500, cursor: 'pointer', appearance: 'none',
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'14\' height=\'8\' viewBox=\'0 0 14 8\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1L7 7L13 1\' stroke=\'%23666666\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")',
              backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
            }}
          >
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>

        <div style={{ marginLeft: 'auto' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {visibleProducts.length} / {filteredAndSortedProducts.length} items
          </span>
        </div>
      </div>

      {/* Product grid */}
      <div className="container" style={{
        padding: '20px 32px 40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
      }}>
        {visibleProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>

      {/* Sentinel */}
      <div ref={loaderRef} style={{ padding: '32px', textAlign: 'center' }}>
        {hasMore ? (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            color: 'var(--text-secondary)', fontSize: '14px',
          }}>
            <div style={{
              width: '18px', height: '18px', borderRadius: '50%',
              border: '2px solid var(--border)',
              borderTopColor: 'var(--text)',
              animation: 'spin 0.7s linear infinite',
            }} />
            Loading more...
          </div>
        ) : (
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            You've seen all {filteredAndSortedProducts.length} products
          </span>
        )}
      </div>

    </div>
  );
}