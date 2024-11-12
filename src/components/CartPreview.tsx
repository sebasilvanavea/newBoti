import { ShoppingBag, X } from 'lucide-react';
import { useCartStore } from '../store/cart-store';
import { cn } from '../lib/utils';

interface CartPreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartPreview({ isOpen, onClose }: CartPreviewProps) {
  const { items, removeItem, total } = useCartStore();

  const formatPrice = (price: number) => {
    return price.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
    });
  };

  if (items.length === 0) {
    return (
      <div
        className={cn(
          'absolute right-0 top-full mt-2 w-96 bg-white dark:bg-zinc-900 rounded-lg shadow-xl p-4 transition-all transform',
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        )}
      >
        <div className="text-center py-6">
          <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Tu carrito está vacío</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'absolute right-0 top-full mt-2 w-96 bg-white dark:bg-zinc-900 rounded-lg shadow-xl transition-all transform',
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
      )}
    >
      <div className="p-4 max-h-96 overflow-auto">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-4 py-2 border-b border-gray-100 dark:border-zinc-800">
            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</h4>
              <p className="text-sm text-purple-500">{formatPrice(item.price)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Cantidad: {item.quantity}</p>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Eliminar producto"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100 dark:border-zinc-800 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-b-lg">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-900 dark:text-white">Total</span>
          <span className="text-lg font-bold text-purple-500">{formatPrice(total)}</span>
        </div>
        <a
          href="/cart"
          className="block w-full bg-purple-500 text-white text-center py-2 rounded-full hover:bg-purple-600 transition-colors"
        >
          Ver Carrito
        </a>
      </div>
    </div>
  );
}