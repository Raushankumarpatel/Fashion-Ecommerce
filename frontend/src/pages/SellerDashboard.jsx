import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function SellerDashboard() {
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [editId, setEditId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "Men",
    stock: "",
    image: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    const user = JSON.parse(storedUser);
    if (user.role !== "seller") {
      navigate("/");
      return;
    }
    setSeller(user);
    loadSellerData(user.id);
  }, []);

  const loadSellerData = async (sellerId) => {
    try {
      setLoading(true);
      // 1. Fetch products created by this seller
      const prodRes = await API.get(`/products?seller=${sellerId}`);
      setProducts(prodRes.data);

      // 2. Fetch all orders and filter items belonging to this seller
      const orderRes = await API.get("/orders");
      const allOrders = orderRes.data;

      // Extract seller products IDs for filtering
      const sellerProductIds = new Set(prodRes.data.map((p) => p._id));

      const filteredOrders = allOrders.filter((order) =>
        order.products.some((item) => sellerProductIds.has(item.productId?._id || item.productId))
      );

      setSellerOrders(filteredOrders);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const productPayload = {
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        size: ["S", "M", "L", "XL"], // default sizes
        color: ["Black", "Blue", "Red", "White"], // default colors
        seller: seller.id,
      };

      if (editId) {
        await API.put(`/products/${editId}`, productPayload);
        alert("Product Updated Successfully!");
        setEditId(null);
      } else {
        await API.post("/products", productPayload);
        alert("Product Added Successfully!");
      }

      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "Men",
        stock: "",
        image: "",
      });

      loadSellerData(seller.id);
    } catch (err) {
      console.error(err);
      alert("Error saving product.");
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await API.delete(`/products/${id}`);
        alert("Product Deleted!");
        loadSellerData(seller.id);
      } catch (err) {
        console.error(err);
        alert("Error deleting product.");
      }
    }
  };

  const startEdit = (product) => {
    setEditId(product._id);
    setNewProduct({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "Men",
      stock: product.stock || "",
      image: product.image || "",
    });
  };

  const handleUpdateItemStatus = async (orderId, productId, itemStatus) => {
    try {
      await API.put(`/orders/${orderId}/item/${productId}`, { itemStatus });
      alert("Delivery status for this specific item updated!");
      loadSellerData(seller.id);
    } catch (err) {
      console.error(err);
      alert("Failed to update item status. Please try again.");
    }
  };

  // 📈 ANALYTICS & COMPUTATIONS
  // 1. Calculate Est. Store Revenue
  const totalRevenue = sellerOrders.reduce((acc, order) => {
    const sellerItems = order.products.filter(
      (item) => products.some((p) => p._id === (item.productId?._id || item.productId))
    );
    const orderSum = sellerItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return acc + orderSum;
  }, 0);

  // 2. Filter products with low stock (< 10)
  const lowStockProducts = products.filter((p) => p.stock < 10);

  // 3. Count products listed per category for chart
  const categoriesList = ["Men", "Women", "Kids", "Footwear", "Accessories", "Activewear", "Winterwear"];
  const categoryStats = categoriesList.reduce((acc, cat) => {
    acc[cat] = products.filter((p) => p.category === cat).length;
    return acc;
  }, {});
  const maxCategoryCount = Math.max(...Object.values(categoryStats), 1);

  // 4. Calculate Top Selling Products (Sorted by sum of quantity in orders)
  const salesCount = {};
  sellerOrders.forEach((order) => {
    order.products.forEach((item) => {
      const pId = (item.productId?._id || item.productId || "").toString();
      if (products.some((p) => p._id === pId)) {
        salesCount[pId] = (salesCount[pId] || 0) + item.quantity;
      }
    });
  });

  const topSellingProducts = [...products]
    .map((p) => ({ ...p, unitsSold: salesCount[p._id] || 0 }))
    .filter((p) => p.unitsSold > 0)
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">Seller Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, {seller?.name || "Merchant"}!</p>
          </div>
          <div className="bg-pink-100 text-pink-700 px-4 py-2 rounded-full font-bold text-sm">
            Seller Portal
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-4xl font-black">{products.length}</h2>
            <p className="mt-1 font-semibold uppercase text-sm text-white/90">Total Listed Products</p>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-4xl font-black">{sellerOrders.length}</h2>
            <p className="mt-1 font-semibold uppercase text-sm text-white/90">Orders Involving Your Products</p>
          </div>

          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-4xl font-black">₹{totalRevenue.toLocaleString("en-IN")}</h2>
            <p className="mt-1 font-semibold uppercase text-sm text-white/90">Est. Store Revenue</p>
          </div>
        </div>

        {/* Analytics & Alerts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Category Sales Chart (Visual SVG/HTML Horizontal Bars) */}
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6">📈 Catalog Category Breakdown</h3>
            <div className="space-y-4">
              {categoriesList.map((cat) => {
                const count = categoryStats[cat];
                const percentage = (count / maxCategoryCount) * 100;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-gray-700">{cat}</span>
                      <span className="text-gray-500 font-bold">{count} Products</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3.5 overflow-hidden">
                      <div
                        className="bg-pink-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Alerts (Low Stock & Top Sellers) */}
          <div className="space-y-6">
            {/* Low Stock Warners */}
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">⚠️ Low Stock Alerts</h3>
              {lowStockProducts.length === 0 ? (
                <p className="text-sm text-green-600 font-semibold">✅ All items are sufficiently stocked.</p>
              ) : (
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {lowStockProducts.map((p) => (
                    <div key={p._id} className="flex justify-between items-center p-3 bg-red-50 border border-red-155 rounded-xl">
                      <span className="text-sm font-bold text-red-950 truncate max-w-[200px]">{p.name}</span>
                      <span className="text-xs font-extrabold text-red-700 bg-red-100 px-2.5 py-1 rounded-full">
                        Only {p.stock} remaining
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Selling Products */}
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🏆 Top Performing Garments</h3>
              {topSellingProducts.length === 0 ? (
                <p className="text-sm text-gray-400 font-semibold">Orders placed will list best performers here.</p>
              ) : (
                <div className="space-y-3">
                  {topSellingProducts.map((p, idx) => (
                    <div key={p._id} className="flex items-center gap-3 p-2 bg-gray-50/50 rounded-xl">
                      <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-700 font-black text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-bold text-gray-800 flex-1 truncate">{p.name}</span>
                      <span className="text-xs text-gray-500 font-bold">{p.unitsSold} units ordered</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add / Edit Product Form */}
          <div className="bg-white p-6 rounded-3xl shadow-xl h-fit border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editId ? "✏️ Edit Product Details" : "📦 List a New Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Designer Woolen Coat"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="1299"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Stock Count *</label>
                  <input
                    type="number"
                    required
                    placeholder="45"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none bg-white"
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Activewear">Activewear</option>
                  <option value="Winterwear">Winterwear</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Product Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder="Tell buyers about material, style, fit, etc."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none h-24 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all text-center"
                >
                  {editId ? "Update Product" : "Publish Product"}
                </button>
                {editId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditId(null);
                      setNewProduct({ name: "", description: "", price: "", category: "Men", stock: "", image: "" });
                    }}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-4 py-3 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Manage Products List */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Listed Products ({products.length})</h2>

              {products.length === 0 ? (
                <div className="text-center py-12 text-gray-400 font-medium">
                  No products added yet. Use the form to list your first fashion item!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50 text-gray-600 font-semibold text-sm">
                        <th className="p-3">Item Details</th>
                        <th className="p-3">Category</th>
                        <th className="p-3 text-center">Price</th>
                        <th className="p-3 text-center">Stock</th>
                        <th className="p-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-all">
                          <td className="p-3 flex items-center gap-3">
                            <img
                              src={product.image || "https://via.placeholder.com/60x60?text=Fashion"}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                            />
                            <div>
                              <span className="font-bold text-gray-800 block text-sm">{product.name}</span>
                              <span className="text-gray-400 text-xs truncate max-w-[150px] block">
                                {product.description || "No description"}
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                              {product.category}
                            </span>
                          </td>
                          <td className="p-3 text-center font-bold text-gray-800">₹{product.price}</td>
                          <td className={`p-3 text-center font-semibold ${product.stock < 10 ? "text-rose-600" : "text-gray-700"}`}>
                            {product.stock} pcs
                          </td>
                          <td className="p-3 text-center space-x-2">
                            <button
                              onClick={() => startEdit(product)}
                              className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-2.5 py-1 rounded-lg text-xs font-bold transition-all"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteProduct(product._id)}
                              className="bg-red-100 hover:bg-red-200 text-red-800 px-2.5 py-1 rounded-lg text-xs font-bold transition-all"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Orders involving Seller products */}
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Customer Orders ({sellerOrders.length})</h2>

              {sellerOrders.length === 0 ? (
                <div className="text-center py-12 text-gray-400 font-medium">
                  No orders placed for your items yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {sellerOrders.map((order) => {
                    const myProductsInOrder = order.products.filter((item) =>
                      products.some((p) => p._id === (item.productId?._id || item.productId))
                    );

                    const mySubTotal = myProductsInOrder.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0
                    );

                    return (
                      <div key={order._id} className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50">
                        <div className="flex justify-between items-start flex-wrap gap-2 mb-3">
                          <div>
                            <span className="font-bold text-gray-900 text-sm">Order ID: #{order._id.slice(-6)}</span>
                            <span className="text-gray-500 text-xs block">Customer: {order.customerName} | Phone: {order.mobile}</span>
                            <span className="text-gray-500 text-xs block">Address: {order.address}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-extrabold text-pink-600 block">₹{mySubTotal} (Your Part)</span>
                            <span className="bg-pink-100 text-pink-700 px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1 inline-block">
                              Order Status: {order.status}
                            </span>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-100 p-3 space-y-3">
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Items:</h4>
                          {myProductsInOrder.map((item, idx) => {
                            const prodId = (item.productId?._id || item.productId).toString();
                            return (
                              <div key={idx} className="flex justify-between items-center text-sm py-2 border-b border-gray-50 last:border-0 flex-wrap gap-2">
                                <div>
                                  <strong className="text-gray-800">{item.name}</strong> ({item.size} / {item.color})
                                  <span className="block text-gray-500 text-xs mt-0.5">₹{item.price} × {item.quantity}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-400 font-semibold">Item Status:</span>
                                  <select
                                    value={item.itemStatus || "Pending"}
                                    onChange={(e) => handleUpdateItemStatus(order._id, prodId, e.target.value)}
                                    className="border rounded-lg p-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-pink-500 font-semibold text-gray-700"
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                  </select>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerDashboard;
