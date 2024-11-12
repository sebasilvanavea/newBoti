import { Trash2 } from 'lucide-react';
import { useCartStore } from '../store/cart-store';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth-store';
import { createOrder } from '../lib/firebase';
import { useState } from 'react';

export function Cart() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const formatPrice = (price: number) => {
    return price.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
    });
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setIsProcessing(true);
      await createOrder({
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total,
        userEmail: user?.email || ''
      });

      clearCart();
      navigate('/profile', { 
        state: { 
          message: '¡Gracias por tu compra! Tu pedido ha sido procesado exitosamente.' 
        }
      });
    } catch (error) {
      console.error('Error al procesar la orden:', error);
      alert('Hubo un error al procesar tu orden. Por favor, intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col items-center justify-center space-y-4 transition-colors">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Tu carrito está vacío
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          ¡Agrega algunos productos a tu carrito!
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-full text-white bg-purple-500 hover:bg-purple-600 transition-colors"
        >
          Ir a Comprar
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-8">
          Carrito de Compras
        </h1>
        <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg shadow transition-colors">
          <div className="p-6 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 pb-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {item.name}
                    </h3>
                    <p className="text-purple-500">{formatPrice(item.price)}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Subtotal: {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, parseInt(e.target.value))
                    }
                    className="rounded bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-purple-500 transition-colors"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                    aria-label="Eliminar producto"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gray-100 dark:bg-zinc-800 px-6 py-4 rounded-b-lg transition-colors">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-gray-600 dark:text-gray-400">
                  Total de productos: {itemCount}
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  Total a pagar:
                </p>
              </div>
              <span className="text-2xl font-bold text-purple-500">
                {formatPrice(total)}
              </span>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className="mt-4 w-full bg-purple-500 text-white py-3 px-4 rounded-full hover:bg-purple-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Procesando...' : 'Finalizar Compra'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}