import { X, Star, Wine, ShoppingCart, Check } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { cn } from '../lib/utils';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  rating?: number;
  category: string;
}

interface ProductDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onAddToCart: () => void;
}

const reviews = [
  { id: 1, author: "María G.", rating: 5, comment: "Excelente producto, muy recomendado." },
  { id: 2, author: "Juan P.", rating: 4, comment: "Buena relación calidad-precio." },
  { id: 3, author: "Carlos M.", rating: 5, comment: "Increíble sabor, volveré a comprar." }
];

const recommendations = [
  { id: 'rec1', name: 'Vino Similar 1', price: 15990, image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=400&h=400' },
  { id: 'rec2', name: 'Vino Similar 2', price: 12990, image: 'https://images.unsplash.com/photo-1586370434639-0fe43b2d32d6?auto=format&fit=crop&w=400&h=400' }
];

export function ProductDetails({ isOpen, onClose, product, onAddToCart }: ProductDetailsProps) {
  const [selectedTab, setSelectedTab] = useState<'description' | 'reviews'>('description');
  const [isAdded, setIsAdded] = useState(false);

  const formatPrice = (price: number) => {
    return price.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
    });
  };

  const handleAddToCart = () => {
    if (isAdded) return;
    
    onAddToCart();
    setIsAdded(true);
    
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
        <Dialog.Panel className="mx-auto max-w-3xl w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden max-h-[95vh] overflow-y-auto">
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute right-2 top-2 sm:right-4 sm:top-4 p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors z-10"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="aspect-square w-full">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <span className="text-xs sm:text-sm font-medium text-purple-500 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                      {product.rating}
                    </span>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {product.name}
                </h2>

                <div className="space-y-4 sm:space-y-6">
                  <div className="flex justify-between items-baseline">
                    <span className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 dark:border-zinc-700 pt-4 sm:pt-6">
                    <div className="flex space-x-2 sm:space-x-4 mb-4">
                      <button
                        onClick={() => setSelectedTab('description')}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                          selectedTab === 'description'
                            ? 'bg-purple-500 text-white'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
                        }`}
                      >
                        Descripción
                      </button>
                      <button
                        onClick={() => setSelectedTab('reviews')}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                          selectedTab === 'reviews'
                            ? 'bg-purple-500 text-white'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
                        }`}
                      >
                        Reseñas
                      </button>
                    </div>

                    <div className="h-32 sm:h-48 overflow-y-auto">
                      {selectedTab === 'description' ? (
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                          {product.description}
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {reviews.map((review) => (
                            <div
                              key={review.id}
                              className="border-b border-gray-200 dark:border-zinc-700 pb-4"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                                  {review.author}
                                </span>
                                <div className="flex">
                                  {[...Array(review.rating)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-yellow-400"
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                {review.comment}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={isAdded}
                    className={cn(
                      "w-full flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-300 text-sm sm:text-base text-white",
                      isAdded
                        ? "bg-green-500 hover:bg-green-500"
                        : "bg-purple-500 hover:bg-purple-600 transform hover:scale-[1.02]"
                    )}
                  >
                    {isAdded ? (
                      <>
                        <Check className="h-4 w-4 sm:h-5 sm:w-5 animate-bounce" />
                        <span className="font-medium">¡Agregado!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="font-medium">Agregar al Carrito</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-zinc-700">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Productos Relacionados
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="flex items-center space-x-3 p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-zinc-800"
                  >
                    <img
                      src={rec.image}
                      alt={rec.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                        {rec.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-purple-500">
                        {formatPrice(rec.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}