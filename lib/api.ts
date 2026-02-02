import { Product, ProductsResponse } from '../types/products';

const API_BASE = 'https://dummyjson.com';

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/products?limit=100`, {
    next: { revalidate: 3600 }
  });
  const data: ProductsResponse = await res.json();
  return data.products;
}

export async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    next: { revalidate: 3600 }
  });
  return res.json();
}

export async function fetchCategories(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/products/category-list`, {
    next: { revalidate: 3600 }
  });
  return res.json();
}