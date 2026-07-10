import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const [form, setForm] = useState({
    customerName: "",
    mobile: "",
    address: "",
  });

  const placeOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const totalAmount = cart.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    );

    const orderData = {
      customerName: form.customerName,
      mobile: form.mobile,
      address: form.address,
      products: cart.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        size: item.selectedSize,
        color: item.selectedColor,
      })),
      totalAmount,
    };

    try {
      await API.post("/orders", orderData);
      alert("Order Placed Successfully!");
      
      // Clear Cart and trigger Navbar refresh
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cart-updated"));
      
      navigate("/orders");
    } catch (error) {
      console.log(error);
      alert("Order Placement Failed. Please try again.");
    }
  };

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-left">Checkout Details</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Shipping Form Card */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3 text-left">
              📦 Shipping Information
            </h2>

            <form onSubmit={placeOrder} className="space-y-5 text-left">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Customer Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all shadow-inner bg-gray-50/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Mobile Number</label>
                <input
                  type="text"
                  placeholder="e.g. +91 98765 43210"
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all shadow-inner bg-gray-50/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Delivery Address</label>
                <textarea
                  placeholder="Street, Landmark, City, Pincode"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all shadow-inner bg-gray-50/50 h-28 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-pink-600/20 transition-all transform hover:-translate-y-0.5 text-center cursor-pointer"
              >
                Place Order (₹{totalAmount})
              </button>
            </form>
          </div>

          {/* Order Summary Column */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-3 text-left">
              📋 Order Summary
            </h2>

            {cart.length === 0 ? (
              <p className="text-sm text-gray-400 font-semibold py-6">Your bag is empty.</p>
            ) : (
              <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto pr-1">
                {cart.map((item, index) => (
                  <div key={index} className="py-3 flex justify-between gap-3 text-left">
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm">{item.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        Size: <span className="text-gray-650 font-bold">{item.selectedSize}</span> | Color: <span className="text-gray-650 font-bold">{item.selectedColor}</span>
                      </p>
                      <p className="text-xs text-pink-600 font-bold mt-0.5">₹{item.price} × {item.quantity || 1}</p>
                    </div>
                    <span className="font-extrabold text-gray-800 text-sm whitespace-nowrap">
                      ₹{item.price * (item.quantity || 1)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-gray-100 pt-4 space-y-3 text-sm font-medium text-gray-500">
              <div className="flex justify-between">
                <span>Shipping fee</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-lg font-black text-gray-900 border-t border-gray-100 pt-3">
                <span>Final Total</span>
                <span className="text-pink-600">₹{totalAmount}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Checkout;