import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function CustomerPortal() {
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCustomer(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 rounded-3xl p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Customer Account Portal</h1>
            <p className="mt-2 text-pink-100 text-lg">
              Welcome back, <strong className="text-white">{customer?.name || "Shopper"}</strong>! Manage your shopping experience here.
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full font-bold text-sm tracking-wide border border-white/20">
            👑 Active Buyer Account
          </div>
        </div>

        {/* Profile Card */}
        {customer && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Profile Details</h3>
              <p className="text-lg font-bold text-gray-800 mt-1">{customer.name}</p>
              <p className="text-sm text-gray-500">{customer.email}</p>
            </div>
            <div className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg font-medium self-start sm:self-center">
              Member Since: 2026
            </div>
          </div>
        )}

        {/* Portal Menu Cards */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-6">Explore Account Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* My Orders Card */}
            <Link
              to="/orders"
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex items-start gap-4"
            >
              <div className="p-4 rounded-xl bg-pink-50 text-pink-600 text-2xl group-hover:bg-pink-500 group-hover:text-white transition-colors">
                🛍️
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg group-hover:text-pink-600 transition-colors">My Orders</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Track delivery progress, review receipt bills, and check active transaction packages.
                </p>
              </div>
            </Link>

            {/* My Returns Card */}
            <Link
              to="/returns"
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex items-start gap-4"
            >
              <div className="p-4 rounded-xl bg-purple-50 text-purple-600 text-2xl group-hover:bg-purple-500 group-hover:text-white transition-colors">
                🔄
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg group-hover:text-purple-600 transition-colors">My Returns</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Review submitted queries, request returns for garments, or check replacement status.
                </p>
              </div>
            </Link>

            {/* My Cart Card */}
            <Link
              to="/cart"
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex items-start gap-4"
            >
              <div className="p-4 rounded-xl bg-blue-50 text-blue-600 text-2xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
                🛒
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">My Shopping Cart</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Review selected garments, sizes, and colors that are ready for final checkout.
                </p>
              </div>
            </Link>

            {/* My Wishlist Card */}
            <Link
              to="/wishlist"
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex items-start gap-4"
            >
              <div className="p-4 rounded-xl bg-rose-50 text-rose-600 text-2xl group-hover:bg-rose-500 group-hover:text-white transition-colors">
                ❤️
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg group-hover:text-rose-600 transition-colors">My Wishlist</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  View and manage all items you pinned to buy later. Move your favorites directly to Cart.
                </p>
              </div>
            </Link>

          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-gray-400 pt-6">
          Need support with your account? Reach out to support@fashionstore.com
        </div>
      </div>
    </div>
  );
}

export default CustomerPortal;