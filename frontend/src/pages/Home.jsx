import { useEffect, useState } from "react";
import API from "../api/api";
import ProductCard from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const categories = ["Men", "Women", "Kids", "Footwear", "Accessories", "Activewear", "Winterwear"];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
      setLoadError("");
    } catch (error) {
      console.error("Unable to load products:", error);
      setLoadError("Products load nahi ho rahe. Backend server check karein.");
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      category === "" || product.category === category;

    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50/50">
      
      {/* 🌟 HERO BANNER SECTION (Fresh Light-Fashion Layout) */}
      <header className="relative bg-gradient-to-br from-pink-50 via-purple-50 to-white text-slate-900 overflow-hidden py-12 lg:py-16 border-b border-purple-100/50">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-pink-300/40 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-purple-300/40 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left: Copywriting & Actions */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <span className="inline-block bg-pink-100 text-pink-700 px-3.5 py-1 rounded-full text-xs font-extrabold tracking-widest uppercase shadow-sm">
              🔥 NEW SEASON COLLECTION 2026
            </span>
            <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight text-slate-900">
              Unleash Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600">
                True Signature Style
              </span>
            </h1>
            <p className="text-gray-600 text-base sm:text-lg max-w-lg leading-relaxed">
              Discover curated apparel, handpicked premium fabrics, and trending designer styles crafted to make you look exceptional.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <button 
                onClick={() => {
                  const target = document.getElementById("catalog-section");
                  target?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-pink-600 hover:bg-pink-700 text-white px-7 py-3 rounded-xl font-extrabold text-xs tracking-wide shadow-md shadow-pink-600/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                Shop Collection 🛒
              </button>
              <button 
                onClick={() => setCategory("Women")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200 px-7 py-3 rounded-xl font-extrabold text-xs tracking-wide transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                Browse Women's
              </button>
            </div>
          </div>

          {/* Right: Floating Light Model Collage */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-72 h-80 md:w-80 md:h-[350px] rounded-3xl overflow-hidden shadow-xl border-4 border-white transform rotate-1 hover:rotate-0 transition-all duration-500">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800"
                alt="High Fashion Shoot"
                className="w-full h-full object-cover scale-102 hover:scale-100 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
              {/* Floating Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-md p-3.5 rounded-xl border border-white/40 text-left shadow-sm">
                <span className="text-[10px] font-bold text-pink-600 block tracking-widest uppercase">EXCLUSIVE DISCOUNTS</span>
                <span className="text-base font-extrabold text-slate-800 block mt-0.5">Flat 20% OFF this week</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 🚀 VALUE PROPOSITION BENEFITS BAR */}
      <section className="bg-white border-b border-gray-150 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <span className="text-3xl text-pink-500">⚡</span>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">Free Delivery</h4>
              <p className="text-gray-400 text-xs mt-0.5">On all order values exceeding ₹999</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-4 border-y md:border-y-0 md:border-x border-gray-100 py-4 md:py-0 md:px-6">
            <span className="text-3xl text-pink-500">🛡️</span>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">Secure Payment Gateway</h4>
              <p className="text-gray-400 text-xs mt-0.5">100% encrypted checkout transfers</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-4">
            <span className="text-3xl text-pink-500">🔄</span>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">Easy Returns</h4>
              <p className="text-gray-400 text-xs mt-0.5">No questions asked 30-day replacement policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🛍️ CATALOG FILTER SECTION */}
      <section id="catalog-section" className="max-w-7xl mx-auto px-6 py-12 scroll-mt-6">
        
        {/* Search & Selection Controls Container */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
          
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="text-left w-full md:w-auto">
              <h2 className="text-2xl font-extrabold text-gray-900">Explore Our Catalog</h2>
              <p className="text-sm text-gray-500 mt-0.5">Find garments matching your fit preference.</p>
            </div>
            
            {/* Search Input */}
            <div className="w-full md:w-80 relative">
              <input
                type="text"
                placeholder="Search Product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2.5 pl-10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all shadow-inner"
              />
              <span className="absolute left-3.5 top-3 text-gray-400 text-sm">🔍</span>
            </div>
          </div>

          {/* Interactive Categories Pill Selection */}
          <div className="border-t border-gray-100 pt-5 text-left">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3">Quick Filter Categories:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategory("")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  category === ""
                    ? "bg-pink-600 border-pink-600 text-white shadow-md shadow-pink-600/10"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:border-pink-500 hover:text-pink-600"
                }`}
              >
                All Collections
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    category === cat
                      ? "bg-pink-600 border-pink-600 text-white shadow-md shadow-pink-600/10"
                      : "bg-gray-50 border-gray-200 text-gray-600 hover:border-pink-500 hover:text-pink-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Count Indicator */}
        <div className="flex justify-between items-center mt-10 border-b border-gray-200 pb-3 text-left">
          <h3 className="text-lg font-bold text-gray-800">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? "Product" : "Products"}
          </h3>
          {category && (
            <span className="text-xs text-gray-500 bg-gray-200 px-3 py-1 rounded-full font-bold">
              Active Category: {category}
            </span>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {loadError ? (
            <div className="col-span-full text-center py-20 text-red-500">
              <p className="text-lg font-semibold">{loadError}</p>
              <p className="text-xs mt-2 text-gray-500">
                Backend ko port 5000 par start karke page refresh karein.
              </p>
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-400">
              <div className="text-5xl mb-2">🔍</div>
              <p className="text-lg font-semibold">No Products Found</p>
              <p className="text-xs mt-1">Try adjusting your filters or search keywords.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-12 mt-20 border-t border-slate-900 text-left">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h3 className="text-2xl font-black text-pink-500">Fashion Store</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Your ultimate wardrobe companion bringing premium designer wear straight to your doorstep since 2026.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-200 uppercase tracking-wider mb-3">Quick Navigation</h4>
            <ul className="space-y-1.5 text-xs text-slate-400 font-semibold">
              <li><a href="#" className="hover:text-pink-400">Latest Arrivals</a></li>
              <li><a href="#" className="hover:text-pink-400">Active Deals</a></li>
              <li><a href="#" className="hover:text-pink-400">Store Directory</a></li>
            </ul>
          </div>
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-sm text-slate-200 uppercase tracking-wider">Contact Info</h4>
            <p className="text-slate-400">📍 Delhi, India</p>
            <p className="text-slate-400">📧 support@fashionstore.com</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 border-t border-slate-900 mt-8 pt-6 text-center text-xs text-slate-500 font-medium">
          © 2026 Fashion Store. All Rights Reserved. Created by Team Antigravity.
        </div>
      </footer>
    </div>
  );
}

export default Home;