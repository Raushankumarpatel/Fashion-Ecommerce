import { useState } from "react";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const addToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select size and color");
      return;
    }

    const oldCart = JSON.parse(localStorage.getItem("cart")) || [];

    const productWithOptions = {
      ...product,
      selectedSize,
      selectedColor,
      quantity: 1,
    };

    localStorage.setItem(
      "cart",
      JSON.stringify([...oldCart, productWithOptions])
    );

    window.dispatchEvent(new Event("cart-updated"));
    alert("Product Added To Cart");
  };

  const addToWishlist = () => {
    const oldWishlist =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    localStorage.setItem(
      "wishlist",
      JSON.stringify([...oldWishlist, product])
    );

    alert("Product Added To Wishlist");
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden">
      
      {/* Product Image */}
      <Link to={`/product/${product._id}`}>
        <img
          src={
            product.image ||
            "https://via.placeholder.com/400x300?text=Fashion+Product"
          }
          alt={product.name}
          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
        />
      </Link>

      {/* Product Details */}
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="text-base font-bold text-gray-800 hover:text-pink-500 transition-colors cursor-pointer line-clamp-1">
            {product.name}
          </h2>
        </Link>

        <p className="text-gray-400 mt-1 text-xs line-clamp-2 h-8 leading-relaxed">
          {product.description || "No description available."}
        </p>

        <p className="text-pink-600 font-extrabold text-lg mt-2">
          ₹{product.price}
        </p>

        <p className="text-xs text-gray-400 mt-1">
          Category: {product.category}
        </p>

        {/* Size Selection */}
        <div className="mt-3">
          <label className="text-xs font-semibold text-gray-600">
            Size
          </label>

          <select
            value={selectedSize}
            onChange={(e) =>
              setSelectedSize(e.target.value)
            }
            className="w-full border border-gray-200 rounded-lg p-1.5 mt-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-pink-500"
          >
            <option value="">
              Select Size
            </option>

            {product.size?.map((size, index) => (
              <option
                key={index}
                value={size}
              >
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Color Selection */}
        <div className="mt-2.5">
          <label className="text-xs font-semibold text-gray-600">
            Color
          </label>

          <select
            value={selectedColor}
            onChange={(e) =>
              setSelectedColor(e.target.value)
            }
            className="w-full border border-gray-200 rounded-lg p-1.5 mt-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-pink-500"
          >
            <option value="">
              Select Color
            </option>

            {product.color?.map((color, index) => (
              <option
                key={index}
                value={color}
              >
                {color}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={addToCart}
            className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg text-xs font-bold tracking-wide transition-all shadow-sm"
          >
            Add To Cart
          </button>

          <button
            onClick={addToWishlist}
            className="px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-all"
          >
            ❤️
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;