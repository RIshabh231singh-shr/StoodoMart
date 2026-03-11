import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, X, Plus, Minus, Trash2, Package } from 'lucide-react';
import { fetchCart, updateCartQuantity, removeFromCart, selectCartTotal } from '../CartSlice';
import { Link } from 'react-router';

export default function CartDrawer({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { cartItems, loading } = useSelector((state) => state.cart);
  const cartTotal = useSelector(selectCartTotal);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCart());
    }
  }, [isOpen, dispatch]);

  // Prevent background page from scrolling while drawer is open
  useEffect(() => {
    const html = document.documentElement;
    if (isOpen) {
      html.classList.add('overflow-hidden');
    } else {
      html.classList.remove('overflow-hidden');
    }
    return () => html.classList.remove('overflow-hidden');
  }, [isOpen]);

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateCartQuantity({ productId, quantity: newQuantity }));
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[999] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-[999] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3 text-slate-900">
            <ShoppingCart size={24} className="text-brand-teal" />
            <h2 className="text-2xl font-black tracking-tight">Your Cart</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading && cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-brand-teal animate-spin" />
              <p className="text-slate-500 font-medium">Loading your cart...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
                <Package size={48} className="text-slate-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Your cart is empty</h3>
                <p className="text-slate-500 max-w-[250px] mx-auto">
                  Looks like you haven't added anything to your cart yet.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-brand-teal transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.productId._id} className="flex gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative group transition-all hover:shadow-md">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0">
                    {item.productId.image ? (
                      <img src={item.productId.image} alt={item.productId.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Package size={24} className="text-slate-300" /></div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start gap-2 pr-6">
                        <h4 className="font-bold text-slate-900 line-clamp-2 leading-snug">{item.productId.name}</h4>
                      </div>
                      <p className="text-brand-teal font-black mt-1">₹{item.productId.price?.toLocaleString('en-IN')}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-200">
                        <button
                          onClick={() => handleUpdateQuantity(item.productId._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 flex items-center justify-center rounded-md bg-white shadow-sm text-slate-600 hover:text-brand-teal disabled:opacity-50 disabled:hover:text-slate-600 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-bold text-slate-900 w-4 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.productId._id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-md bg-white shadow-sm text-slate-600 hover:text-brand-teal transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.productId._id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 bg-slate-50 border-t border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-bold text-slate-600">Subtotal</span>
              <span className="text-2xl font-black text-slate-900">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>

            <Link
              to="/checkout"
              onClick={onClose}
              className="w-full py-4 text-lg bg-gradient-to-r from-brand-red to-brand-orange text-white rounded-xl font-bold flex items-center justify-center shadow-[0_8px_15px_rgba(255,75,43,0.3)] hover:shadow-[0_12px_25px_rgba(255,75,43,0.4)] active:scale-[0.98] transition-all"
            >
              Checkout Now
            </Link>
            <p className="text-center text-xs text-slate-500 mt-4 font-medium">Shipping and taxes calculated at checkout.</p>
          </div>
        )}
      </div>
    </>
  );
}
