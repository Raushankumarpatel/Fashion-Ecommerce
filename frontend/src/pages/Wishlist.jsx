import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWishlistItems, saveStoredArray } from "../utils/cartUtils";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    setWishlist(getWishlistItems());
  }, []);

  const removeFromWishlist = (index) => {
    const updatedWishlist = wishlist.filter(
      (_, i) => i !== index
    );

    setWishlist(updatedWishlist);

    saveStoredArray("wishlist", updatedWishlist);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-left">My Wishlist ❤️</h1>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-6">
            <div className="text-6xl">💝</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Your Wishlist is Empty</h2>
              <p className="text-gray-400 text-sm mt-1">Save your favorite fashion picks here for later.</p>
            </div>
            <Link to="/" className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-3 rounded-xl transition-all">
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <img
                src={
                  item.image ||
                  "https://via.placeholder.com/300"
                }
                alt={item.name}
                className="w-full h-60 object-cover"
              />

              <div className="p-4">
                <h2 className="text-xl font-bold">
                  {item.name}
                </h2>

                <p className="text-gray-500 mt-2">
                  {item.description}
                </p>

                <p className="text-pink-600 font-bold text-2xl mt-3">
                  ₹{item.price}
                </p>

                <div className="flex gap-2 mt-4">
                  <Link to={`/product/${item._id}`} className="flex-1 text-center bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg font-semibold">
                    View
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(index)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;