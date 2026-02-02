import { fetchProducts, fetchCategories } from '../lib/api';
import ProductList from '../components/ProductList';

export const dynamic = 'force-static';

export default async function Home() {
  const [products, categories] = await Promise.all([
    fetchProducts(),
    fetchCategories()
  ]);

  return (
    <main>
      <div style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f7 100%)',
        borderBottom: '1px solid var(--border)'
      }}>
        <header className="container" style={{ 
          padding: '80px 32px 60px',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            fontSize: '64px', 
            marginBottom: '20px',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #111111 0%, #444444 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.1,
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Discover Premium Products
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '20px',
            fontWeight: 400,
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.5,
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Explore our carefully curated collection of {products.length} exceptional items
          </p>
        </header>
      </div>
      <ProductList initialProducts={products} categories={categories} />
    </main>
  );
}