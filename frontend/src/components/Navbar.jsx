import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(totalItems);
    };

    updateCount();
    window.addEventListener("cart-updated", updateCount);
    return () => window.removeEventListener("cart-updated", updateCount);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <nav className="bg-black text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-pink-500 hover:opacity-90">
          Fashion Store
        </Link>

        <div className="flex gap-6 text-sm font-semibold tracking-wide items-center">
          <Link to="/" className="hover:text-pink-500 uppercase">
            Home
          </Link>

          {/* Conditional Links based on Role */}
          {user && user.role === "admin" && (
            <Link to="/admin" className="hover:text-pink-500 font-semibold text-pink-400">
              Admin Dashboard
            </Link>
          )}

          {user && user.role === "seller" && (
            <Link to="/seller" className="hover:text-pink-500 font-semibold text-pink-400">
              Seller Dashboard
            </Link>
          )}

          {(!user || user.role === "customer") && (
            <>
              <Link to="/cart" className="hover:text-pink-500 flex items-center gap-1.5">
                Cart
                {cartCount > 0 && (
                  <span className="bg-pink-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link to="/wishlist" className="hover:text-pink-500">
                Wishlist
              </Link>
              <Link to="/orders" className="hover:text-pink-500">
                Orders
              </Link>
              <Link to="/portal" className="hover:text-pink-500">
                Portal
              </Link>
            </>
          )}

          {/* Auth State Button */}
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300 font-medium">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-pink-600 hover:bg-pink-700 px-4 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-pink-600 hover:bg-pink-700 px-4 py-1.5 rounded-lg text-sm font-bold transition-all text-center"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;