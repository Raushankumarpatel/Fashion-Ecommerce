import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/products/${id}`);
      setProduct(res.data);
      if (res.data.size && res.data.size.length > 0) {
        setSelectedSize(res.data.size[0]);
      }
      if (res.data.color && res.data.color.length > 0) {
        setSelectedColor(res.data.color[0]);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Product details could not be loaded. Please try again.");
      setLoading(false);
    }
  };

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
      quantity,
    };

    // Check if item already exists in cart with same size & color
    const existingIndex = oldCart.findIndex(
      (item) =>
        item._id === product._id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );

    if (existingIndex > -1) {
      oldCart[existingIndex].quantity += quantity;
    } else {
      oldCart.push(productWithOptions);
    }

    localStorage.setItem("cart", JSON.stringify(oldCart));
    window.dispatchEvent(new Event("cart-updated"));
    showNotification("Product successfully added to your Cart!");
  };

  const addToWishlist = () => {
    const oldWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    const isExist = oldWishlist.some((item) => item._id === product._id);
    if (!isExist) {
      oldWishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(oldWishlist));
    }
    showNotification("Product added to your Wishlist!");
  };

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg("");
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <p className="text-xl text-gray-700 font-semibold mb-6">{error || "Product not found."}</p>
        <Link to="/" className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold shadow">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back navigation */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-gray-600 hover:text-black font-medium transition-all"
        >
          ← Back
        </button>

        {successMsg && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-sm animate-pulse text-center">
            {successMsg}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-12">
          {/* Product Image */}
          <div className="rounded-2xl overflow-hidden bg-gray-100 h-96 md:h-full flex items-center justify-center">
            <img
              src={product.image || "https://via.placeholder.com/500x500?text=Fashion+Product"}
              alt={product.name}
              className="w-full h-full object-cover max-h-[500px]"
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-sm font-semibold text-pink-600 uppercase tracking-wider">
                {product.category}
              </span>
              <h1 className="text-4xl font-extrabold text-gray-900 mt-2">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 mt-4">
                <div className="flex text-yellow-400 text-lg">★★★★★</div>
                <span className="text-sm text-gray-500">(4.8 out of 5 - 42 Reviews)</span>
              </div>

              <p className="text-3xl font-extrabold text-pink-600 mt-6">
                ₹{product.price}
              </p>

              <div className="border-t border-b border-gray-100 py-6 my-6">
                <h3 className="font-semibold text-gray-900 mb-2">Product Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || "No description provided for this fashion item."}
                </p>
              </div>

              {/* Sizes */}
              {product.size && product.size.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Available Sizes</h3>
                  <div className="flex gap-3 flex-wrap">
                    {product.size.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg font-medium border transition-all ${
                          selectedSize === size
                            ? "bg-black text-white border-black shadow"
                            : "bg-white text-gray-700 border-gray-300 hover:border-black"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {product.color && product.color.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Colors</h3>
                  <div className="flex gap-3 flex-wrap">
                    {product.color.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-lg font-medium border transition-all ${
                          selectedColor === color
                            ? "bg-black text-white border-black shadow"
                            : "bg-white text-gray-700 border-gray-300 hover:border-black"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Status & Quantity */}
              <div className="flex items-center gap-6 mb-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Quantity</h3>
                  <div className="flex items-center border border-gray-300 rounded-lg max-w-[120px]">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="px-3 py-2 text-gray-600 hover:text-black font-bold"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-semibold text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="px-3 py-2 text-gray-600 hover:text-black font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="self-end pb-1">
                  <span className={`font-semibold ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                    {product.stock > 0 ? `In Stock (${product.stock} items)` : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={addToCart}
                disabled={product.stock <= 0}
                className={`flex-1 text-white py-4 rounded-xl font-bold shadow-lg text-center transition-all ${
                  product.stock > 0
                    ? "bg-pink-600 hover:bg-pink-700 hover:shadow-pink-200"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {product.stock > 0 ? "Add to Cart 🛒" : "Out of Stock"}
              </button>

              <button
                onClick={addToWishlist}
                className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl shadow-md flex items-center justify-center transition-all"
              >
                Add to Wishlist ❤️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
