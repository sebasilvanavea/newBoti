import { useState } from 'react';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Sidebar } from '../components/Sidebar';
import { useSearchStore } from '../store/search-store';

export function Home() {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const searchQuery = useSearchStore((state) => state.searchQuery);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;
    
    if (!searchQuery) return matchesCategory;

    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <main className="flex-1 bg-gray-50 dark:bg-zinc-950 transition-colors w-full">
        <div className="max-w-[2000px] mx-auto px-3 sm:px-4 lg:px-6 py-4 md:py-8">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-2 md:mb-4">
              Bienvenido a La Botillería
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
              Descubre nuestra selección premium de bebidas cuidadosamente seleccionadas para ti
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                No se encontraron productos que coincidan con tu búsqueda
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}