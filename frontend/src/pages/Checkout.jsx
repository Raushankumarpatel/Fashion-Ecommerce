import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { getCartItems, getCartTotal, saveStoredArray } from "../utils/cartUtils";

function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setCart(getCartItems());
  }, []);

  const [form, setForm] = useState({
    customerName: "",
    mobile: "",
    address: "",
  });

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async (orderData, totalAmount) => {
    setIsProcessing(true);
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
        setIsProcessing(false);
        return;
      }

      // Step 1: Create Razorpay Order on Backend
      const { data: rzpOrder } = await API.post("/orders/razorpay-order", {
        amount: totalAmount,
      });

      if (rzpOrder.isMock) {
        // Simulation mode for test / development without live secret keys
        const confirmMock = window.confirm(
          `[Razorpay Simulation]\nTotal Amount: ₹${totalAmount}\n\nClick OK to simulate successful payment.`
        );
        if (!confirmMock) {
          setIsProcessing(false);
          return;
        }

        await API.post("/orders/verify-payment", {
          razorpay_order_id: rzpOrder.id,
          razorpay_payment_id: "pay_mock_" + Date.now(),
          razorpay_signature: "mock_signature",
          orderData,
          isMock: true,
        });

        alert("🎉 Payment Successful (Simulation Mode)! Order Placed.");
        saveStoredArray("cart", []);
        window.dispatchEvent(new Event("cart-updated"));
        navigate("/orders");
        return;
      }

      // Step 2: Open real Razorpay Popup
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_sample_key_id",
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: "Fashion Store",
        description: "Order Payment",
        order_id: rzpOrder.id,
        handler: async (response) => {
          try {
            await API.post("/orders/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData,
            });
            alert("🎉 Payment Successful! Order Placed.");
            saveStoredArray("cart", []);
            window.dispatchEvent(new Event("cart-updated"));
            navigate("/orders");
          } catch (err) {
            console.error(err);
            alert("Payment Verification Failed! Please contact support.");
          }
        },
        prefill: {
          name: form.customerName,
          contact: form.mobile,
        },
        theme: {
          color: "#ec4899",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        alert(`Payment Failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Failed to initialize payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCodPayment = async (orderData) => {
    setIsProcessing(true);
    try {
      await API.post("/orders", {
        ...orderData,
        paymentMethod: "COD",
        paymentStatus: "Pending",
      });
      alert("🎉 Order Placed Successfully via Cash on Delivery!");

      saveStoredArray("cart", []);
      window.dispatchEvent(new Event("cart-updated"));
      navigate("/orders");
    } catch (error) {
      console.error(error);
      alert("Order Placement Failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const totalAmount = getCartTotal(cart);

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

    if (paymentMethod === "Razorpay") {
      await handleRazorpayPayment(orderData, totalAmount);
    } else {
      await handleCodPayment(orderData);
    }
  };

  const totalAmount = getCartTotal(cart);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-left">Checkout Details</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Shipping & Payment Form Card */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3 text-left">
              📦 Shipping Information
            </h2>

            <form onSubmit={placeOrder} className="space-y-5 text-left">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Customer Name
                </label>
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
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Mobile Number
                </label>
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
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Delivery Address
                </label>
                <textarea
                  placeholder="Street, Landmark, City, Pincode"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all shadow-inner bg-gray-50/50 h-24 resize-none"
                  required
                />
              </div>

              {/* Payment Method Selection */}
              <div className="pt-3 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  💳 Payment Method
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Razorpay Online Payment Option */}
                  <label
                    onClick={() => setPaymentMethod("Razorpay")}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "Razorpay"
                        ? "border-pink-600 bg-pink-50/40 shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Razorpay"
                      checked={paymentMethod === "Razorpay"}
                      onChange={() => setPaymentMethod("Razorpay")}
                      className="accent-pink-600 w-4 h-4"
                    />
                    <div>
                      <div className="font-bold text-sm text-gray-800 flex items-center gap-1.5">
                        <span>💳 Online Payment</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">UPI, Cards, NetBanking (Razorpay)</p>
                    </div>
                  </label>

                  {/* Cash on Delivery Option */}
                  <label
                    onClick={() => setPaymentMethod("COD")}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "COD"
                        ? "border-pink-600 bg-pink-50/40 shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      className="accent-pink-600 w-4 h-4"
                    />
                    <div>
                      <div className="font-bold text-sm text-gray-800 flex items-center gap-1.5">
                        <span>💵 Cash on Delivery</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">Pay cash when order arrives</p>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full mt-4 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-pink-600/20 transition-all transform hover:-translate-y-0.5 text-center cursor-pointer flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Processing Order...</span>
                ) : (
                  <span>
                    {paymentMethod === "Razorpay" ? "Pay Now & Place Order" : "Place Order (COD)"} (₹{totalAmount})
                  </span>
                )}
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
                <span>Selected Payment</span>
                <span className="text-pink-600 font-bold">
                  {paymentMethod === "Razorpay" ? "Online (Razorpay)" : "Cash on Delivery"}
                </span>
              </div>
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