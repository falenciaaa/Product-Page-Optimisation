import { fetchProduct, fetchProducts } from '../../../lib/api';
import { notFound } from 'next/navigation';
import ImageCarousel from '../../../components/ImageCarousel';
import BackLink from '../../../components/BackLink';

export async function generateStaticParams() {
  const products = await fetchProducts();
  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let product;
  
  try {
    product = await fetchProduct(id);
  } catch {
    notFound();
  }

  const inStock = product.stock > 0;
  const status = product.availabilityStatus || (inStock ? 'In Stock' : 'Out of Stock');

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div className="container" style={{ padding: '60px 32px 100px' }}>
        <BackLink />

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1.3fr 1fr',
          gap: '80px',
          animation: 'fadeIn 0.6s ease-out',
          background: 'var(--surface)',
          padding: '48px',
          borderRadius: '24px',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border)'
        }}>
          <ImageCarousel images={product.images} title={product.title} />

          <div>
            <div style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              padding: '6px 14px',
              background: 'rgba(0, 113, 227, 0.1)',
              borderRadius: '100px',
              fontSize: '12px',
              marginBottom: '16px',
              color: 'var(--accent)',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              {product.category.replace(/-/g, ' ')}
            </div>

            <h1 style={{ 
              fontSize: '48px', 
              marginBottom: '20px',
              lineHeight: '1.1',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              {product.title}
            </h1>

            <div style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              padding: '10px 18px',
              background: inStock ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1.5px solid ${inStock ? '#10b981' : '#ef4444'}`,
              borderRadius: '12px',
              fontSize: '14px',
              marginBottom: '32px',
              color: inStock ? '#059669' : '#dc2626',
              fontWeight: 600,
              gap: '8px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              <span style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%',
                background: inStock ? '#10b981' : '#ef4444'
              }}></span>
              {status}
            </div>

            <p style={{ 
              fontSize: '17px', 
              lineHeight: '1.7',
              marginBottom: '40px',
              color: 'var(--text-secondary)',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              {product.description}
            </p>

            <div style={{
              padding: '32px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '20px',
              marginBottom: '32px',
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
            }}>
              <div style={{ 
                fontSize: '15px',
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: '8px',
                fontWeight: 500,
                letterSpacing: '0.02em',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                Price
              </div>
              <div style={{ 
                fontSize: '52px', 
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.03em',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                ${product.price.toFixed(2)}
              </div>
            </div>

            <div style={{ 
              padding: '32px',
              background: 'var(--bg)',
              borderRadius: '20px',
              border: '1px solid var(--border)'
            }}>
              <h3 style={{ 
                fontSize: '13px',
                fontWeight: 700,
                marginBottom: '24px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                Product Specifications
              </h3>
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ 
                    color: 'var(--text-secondary)', 
                    fontWeight: 500,
                    fontSize: '15px',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}>
                    Brand
                  </span>
                  <span style={{ 
                    color: 'var(--text)', 
                    fontWeight: 600,
                    fontSize: '15px',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}>
                    {product.brand}
                  </span>
                </div>
                <div style={{ 
                  height: '1px', 
                  background: 'var(--border)'
                }}></div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ 
                    color: 'var(--text-secondary)', 
                    fontWeight: 500,
                    fontSize: '15px',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}>
                    Rating
                  </span>
                  <span style={{ 
                    color: 'var(--text)', 
                    fontWeight: 600,
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}>
                    <span style={{ color: '#f59e0b' }}>★</span>
                    {product.rating}/5
                  </span>
                </div>
                <div style={{ 
                  height: '1px', 
                  background: 'var(--border)'
                }}></div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ 
                    color: 'var(--text-secondary)', 
                    fontWeight: 500,
                    fontSize: '15px',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}>
                    Available Stock
                  </span>
                  <span style={{ 
                    color: 'var(--text)', 
                    fontWeight: 600,
                    fontSize: '15px',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}>
                    {product.stock} units
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}