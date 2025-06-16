
import { Product } from '@/types/emailBlocks';

export const dummyProducts: Product[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop',
    title: 'Premium Laptop',
    description: 'High-performance laptop perfect for work and entertainment',
    price: 899.99,
    originalPrice: 1199.99,
    link: '#'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop',
    title: 'Modern Workspace Setup',
    description: 'Complete workspace solution with ergonomic design',
    price: 649.99,
    originalPrice: 799.99,
    link: '#'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
    title: 'Tech Circuit Board',
    description: 'Advanced technology components for professionals',
    price: 299.99,
    originalPrice: 399.99,
    link: '#'
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop',
    title: 'Development Monitor',
    description: 'Ultra-wide monitor perfect for programming and development',
    price: 549.99,
    originalPrice: 699.99,
    link: '#'
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop',
    title: 'MacBook Pro',
    description: 'Apple MacBook Pro with M1 chip for creative professionals',
    price: 1299.99,
    originalPrice: 1499.99,
    link: '#'
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop',
    title: 'Professional Workstation',
    description: 'Complete workstation setup for remote work productivity',
    price: 799.99,
    originalPrice: 999.99,
    link: '#'
  }
];

export const productCategories = [
  'Electronics',
  'Computers',
  'Accessories',
  'Software',
  'Hardware'
];

export const getRandomProducts = (count: number = 3): Product[] => {
  const shuffled = [...dummyProducts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, dummyProducts.length));
};

export const getProductById = (id: string): Product | undefined => {
  return dummyProducts.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  // For demo purposes, return random products since we don't have category field
  return getRandomProducts(3);
};
