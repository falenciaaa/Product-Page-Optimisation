'use client';

import { useState, useMemo } from 'react';
import { Product } from '../types/products';
import ProductCard from './ProductCard';

interface Props {
  initialProducts: Product[];
  categories: string[];
}

export default function ProductList({ initialProducts, categories }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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

  return (
    <div className="container" style={{ padding: '60px 32px 100px' }}>
      <div style={{ 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        gap: '16px', 
        marginBottom: '56px',
        flexWrap: 'wrap',
        alignItems: 'center',
        background: 'var(--surface)',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border)'
      }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 44px 14px 16px',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              color: 'var(--text)',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'14\' height=\'8\' viewBox=\'0 0 14 8\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1L7 7L13 1\' stroke=\'%23666666\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 16px center',
              transition: 'all 0.2s'
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

        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Sort By
          </label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            style={{
              width: '100%',
              padding: '14px 44px 14px 16px',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              color: 'var(--text)',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'14\' height=\'8\' viewBox=\'0 0 14 8\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1L7 7L13 1\' stroke=\'%23666666\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 16px center',
              transition: 'all 0.2s'
            }}
          >
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>

        <div style={{
          flex: 1,
          minWidth: '200px',
          textAlign: 'right'
        }}>
          <label style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Results
          </label>
          <div style={{ 
            fontSize: '28px',
            fontWeight: 700,
            color: 'var(--text)',
            lineHeight: 1
          }}>
            {filteredAndSortedProducts.length}
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '24px'
      }}>
        {filteredAndSortedProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  );
}