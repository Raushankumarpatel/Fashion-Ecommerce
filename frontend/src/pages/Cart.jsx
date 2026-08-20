import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCartItems, getCartTotal, saveStoredArray } from "../utils/cartUtils";

function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(getCartItems());
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    saveStoredArray("cart", newCart);
    window.dispatchEvent(new Event("cart-updated"));
  };

  const increaseQty = (index) => {
    const newCart = [...cart];
    newCart[index].quantity = (newCart[index].quantity || 1) + 1;
    updateCart(newCart);
  };

  const decreaseQty = (index) => {
    const newCart = [...cart];
    newCart[index].quantity = (newCart[index].quantity || 1) - 1;

    if (newCart[index].quantity <= 0) {
      newCart.splice(index, 1);
    }

    updateCart(newCart);
  };

  const removeItem = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    updateCart(newCart);
  };

  const totalAmount = getCartTotal(cart);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-left">Your Shopping Bag</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-6">
            <div className="text-6xl">🛒</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Your Bag is Empty</h2>
              <p className="text-gray-400 text-sm mt-1">Looks like you haven't added any fashion items yet.</p>
            </div>
            <Link
              to="/"
              className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow shadow-pink-600/20"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    {/* Item Thumbnail */}
                    <img
                      src={item.image || "https://via.placeholder.com/100x100?text=Fashion"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl bg-gray-100 border border-gray-100"
                    />
                    <div className="text-left">
                      <h2 className="text-base font-bold text-gray-900 line-clamp-1">{item.name}</h2>
                      <p className="text-pink-600 font-extrabold text-sm mt-0.5">₹{item.price}</p>
                      <div className="flex gap-2 mt-1 text-[11px] font-bold text-gray-500">
                        <span className="bg-gray-100 px-2 py-0.5 rounded-md">Size: {item.selectedSize}</span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded-md">Color: {item.selectedColor}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex items-center gap-3 ml-auto sm:ml-0">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => decreaseQty(index)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-50 font-bold transition-colors"
                      >
                        -
                      </button>
                      <span className="px-3 text-sm font-semibold text-gray-900">{item.quantity || 1}</span>
                      <button
                        onClick={() => increaseQty(index)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-50 font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(index)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cost Summary Column */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Checkout Summary</h3>
              
              <div className="space-y-3 text-sm text-gray-500 font-medium">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="text-gray-800">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="text-emerald-600 font-bold">FREE</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-extrabold text-gray-900">
                  <span>Total Amount</span>
                  <span className="text-pink-650">₹{totalAmount}</span>
                </div>
              </div>

              <Link to="/checkout" className="block">
                <button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 text-center cursor-pointer">
                  Proceed To Checkout 💳
                </button>
              </Link>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;