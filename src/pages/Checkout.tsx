import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cart-store';
import { useAuthStore } from '../store/auth-store';

export function Checkout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { items, total, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Por ahora, mostraremos un mensaje ya que Stripe no está configurado
    setError('El sistema de pagos está en mantenimiento. Por favor, intenta más tarde.');
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-8">
          Finalizar Compra
        </h1>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Resumen del Pedido
            </h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
                {error}
              </div>
            )}

            <div className="divide-y divide-gray-200 dark:divide-zinc-700">
              {items.map((item) => (
                <div key={item.id} className="py-4 flex justify-between">
                  <div>
                    <p className="text-gray-900 dark:text-white">{item.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                  <p className="text-purple-600">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-zinc-800 px-6 py-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900 dark:text-white">
                Total a pagar
              </span>
              <span className="text-2xl font-bold text-purple-600">
                {formatPrice(total)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || items.length === 0}
              className="mt-4 w-full bg-purple-500 text-white py-3 px-4 rounded-full hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Procesando...' : 'Finalizar Compra'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}