import { Minus, Plus, ShoppingCart, Star, Info, Check } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '../store/cart-store';
import { cn } from '../lib/utils';
import { FavoriteButton } from './FavoriteButton';
import { ProductDetails } from './ProductDetails';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  rating?: number;
  category: string;
}

export function ProductCard({ id, name, price, image, description, rating = 4.5, category }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const formatPrice = (price: number) => {
    return price.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
    });
  };

  const handleAddToCart = () => {
    if (isAdded) return;

    for (let i = 0; i < quantity; i++) {
      addItem({ id, name, price, image });
    }
    setQuantity(1);
    setIsAdded(true);
    
    // Restaurar el botón después de 2 segundos
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <>
      <div
        className="group bg-white dark:bg-zinc-900 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] h-full flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden aspect-square">
          <img
            src={image}
            alt={name}
            loading="lazy"
            className={cn(
              "w-full h-full object-cover transition-transform duration-500",
              isHovered ? "scale-110" : "scale-100"
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <FavoriteButton productId={id} />
          
          <button
            onClick={() => setShowDetails(true)}
            className="absolute bottom-2 right-2 p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm transition-all duration-300 hover:scale-110"
            aria-label="Ver detalles"
          >
            <Info className="h-5 w-5 text-purple-500" />
          </button>
        </div>
        
        <div className="p-3 sm:p-4 flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-purple-500 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
              {category}
            </span>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">{rating}</span>
            </div>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 line-clamp-2">
            {name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 flex-grow line-clamp-2">
            {description}
          </p>
          
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-base sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                {formatPrice(price)}
              </span>
              <div className="flex items-center space-x-1 bg-gray-100 dark:bg-zinc-800 rounded-full p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 hover:text-purple-500 transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700"
                  aria-label="Disminuir cantidad"
                  disabled={isAdded}
                >
                  <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
                <span className="w-6 sm:w-8 text-center text-sm font-medium text-gray-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="p-1 hover:text-purple-500 transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700"
                  aria-label="Aumentar cantidad"
                  disabled={isAdded}
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={isAdded}
              className={cn(
                "w-full flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-300 text-xs sm:text-sm",
                isAdded
                  ? "bg-green-500 hover:bg-green-500"
                  : "bg-purple-500 hover:bg-purple-600 transform hover:scale-[1.02]",
                "text-white"
              )}
            >
              {isAdded ? (
                <>
                  <Check className="h-4 w-4 animate-bounce" />
                  <span className="font-medium">¡Agregado!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  <span className="font-medium">Agregar al Carrito</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <ProductDetails
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        product={{ id, name, price, image, description, rating, category }}
        onAddToCart={handleAddToCart}
      />
    </>
  );
}