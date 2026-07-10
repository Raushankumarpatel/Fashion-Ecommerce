import { useEffect, useState } from "react";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const savedWishlist =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    setWishlist(savedWishlist);
  }, []);

  const removeFromWishlist = (index) => {
    const updatedWishlist = wishlist.filter(
      (_, i) => i !== index
    );

    setWishlist(updatedWishlist);

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updatedWishlist)
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-8">
        My Wishlist ❤️
      </h1>

      {wishlist.length === 0 ? (
        <div className="text-center">
          <h2 className="text-2xl text-gray-500">
            Wishlist is Empty
          </h2>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

                <button
                  onClick={() =>
                    removeFromWishlist(index)
                  }
                  className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;