import { useEffect, useState } from "react";
import API from "../api/api";

function Admin() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  
  // Sidebar Tabs State
  const [activeTab, setActiveTab] = useState("overview");

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "Men",
    stock: "",
    image: "",
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchReturns();
  }, []);

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  const fetchOrders = async () => {
    const res = await API.get("/orders");
    setOrders(res.data);
  };

  const fetchReturns = async () => {
    const res = await API.get("/returns");
    setReturns(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await API.put(`/products/${editId}`, {
        ...newProduct,
        size: ["S", "M", "L", "XL"],
        color: ["Black", "Blue", "Red"],
      });
      alert("Product Updated");
      setEditId(null);
    } else {
      await API.post("/products", {
        ...newProduct,
        size: ["S", "M", "L", "XL"],
        color: ["Black", "Blue", "Red"],
      });
      alert("Product Added");
    }

    setNewProduct({
      name: "",
      description: "",
      price: "",
      category: "Men",
      stock: "",
      image: "",
    });

    fetchProducts();
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await API.delete(`/products/${id}`);
      alert("Product Deleted");
      fetchProducts();
    }
  };

  const startEdit = (product) => {
    setEditId(product._id);
    setActiveTab("products"); // Switch to products tab so they can see the edit form
    setNewProduct({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "Men",
      stock: product.stock || "",
      image: product.image || "",
    });
  };

  const updateOrderStatus = async (id, status) => {
    await API.put(`/orders/${id}/status`, { status });
    alert("Order Status Updated");
    fetchOrders();
  };

  const updateReturnStatus = async (id, status) => {
    await API.put(`/returns/${id}/status`, { status });
    alert("Return Status Updated");
    fetchReturns();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800">
        <div className="p-6 border-b border-slate-800">
          <span className="text-xl font-extrabold text-pink-500 tracking-wider block">ADMIN CONSOLE</span>
          <span className="text-xs text-slate-400 mt-1 block">Fashion Store System</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
              activeTab === "overview"
                ? "bg-pink-600 text-white shadow-md shadow-pink-900/20"
                : "text-slate-350 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span>📊</span> Dashboard Overview
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
              activeTab === "products"
                ? "bg-pink-600 text-white shadow-md shadow-pink-900/20"
                : "text-slate-350 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span>🛍️</span> Manage Products
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
              activeTab === "orders"
                ? "bg-pink-600 text-white shadow-md shadow-pink-900/20"
                : "text-slate-350 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span>📦</span> Order Tracker
          </button>

          <button
            onClick={() => setActiveTab("returns")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
              activeTab === "returns"
                ? "bg-pink-600 text-white shadow-md shadow-pink-900/20"
                : "text-slate-350 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span>🔄</span> Return Requests
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 text-center">
          <span className="text-xs text-slate-500">v1.2.0 • Secured Console</span>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-500 mt-1">Platform analytics and summary statistics.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
                <div className="p-4 rounded-xl bg-blue-50 text-blue-600 text-2xl">🛍️</div>
                <div>
                  <h2 className="text-3xl font-black text-gray-800">{products.length}</h2>
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Products</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
                <div className="p-4 rounded-xl bg-green-50 text-green-600 text-2xl">📦</div>
                <div>
                  <h2 className="text-3xl font-black text-gray-800">{orders.length}</h2>
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Orders</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
                <div className="p-4 rounded-xl bg-red-50 text-red-600 text-2xl">🔄</div>
                <div>
                  <h2 className="text-3xl font-black text-gray-800">{returns.length}</h2>
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Return Requests</p>
                </div>
              </div>
            </div>

            {/* Quick Summary Section */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Admin Shortcuts & System Logs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => setActiveTab("products")} 
                  className="p-4 text-left border rounded-xl hover:bg-gray-50 transition"
                >
                  <span className="font-bold text-sm block text-gray-700">Add New Products</span>
                  <span className="text-xs text-gray-400">Post garments catalog directly onto the homepage.</span>
                </button>
                <button 
                  onClick={() => setActiveTab("orders")} 
                  className="p-4 text-left border rounded-xl hover:bg-gray-50 transition"
                >
                  <span className="font-bold text-sm block text-gray-700">Dispatch Pending Orders</span>
                  <span className="text-xs text-gray-400">Change statuses of active customer transactions.</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE PRODUCTS */}
        {activeTab === "products" && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Manage Products</h1>
              <p className="text-gray-500 mt-1">Upload new products or edit active items on the catalog.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Product Form */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  {editId ? "✏️ Edit Product Details" : "📦 Add a New Product"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Product Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Product Name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Price (₹)</label>
                      <input
                        type="number"
                        required
                        placeholder="Price"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Stock</label>
                      <input
                        type="number"
                        required
                        placeholder="Stock"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 bg-white"
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
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Image URL</label>
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                      className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                    <textarea
                      placeholder="Product description..."
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 h-20 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2.5 rounded-lg transition text-sm shadow"
                  >
                    {editId ? "Update Product" : "Publish Product"}
                  </button>
                </form>
              </div>

              {/* Products List Table */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-x-auto">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Active Listings ({products.length})</h2>
                
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-gray-600 font-semibold text-xs uppercase">
                      <th className="p-3">Item Details</th>
                      <th className="p-3">Category</th>
                      <th className="p-3 text-center">Price</th>
                      <th className="p-3 text-center">Stock</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                        <td className="p-3 flex items-center gap-3">
                          <img
                            src={product.image || "https://via.placeholder.com/60x60?text=Garment"}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-lg bg-gray-100"
                          />
                          <div>
                            <span className="font-bold text-gray-800 text-sm block">{product.name}</span>
                            <span className="text-gray-400 text-xs line-clamp-1 max-w-[150px]">{product.description}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                            {product.category}
                          </span>
                        </td>
                        <td className="p-3 text-center font-bold text-gray-850">₹{product.price}</td>
                        <td className={`p-3 text-center font-semibold text-sm ${product.stock < 10 ? "text-red-500" : "text-gray-700"}`}>
                          {product.stock} pcs
                        </td>
                        <td className="p-3 text-center space-x-2">
                          <button
                            onClick={() => startEdit(product)}
                            className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-bold hover:bg-amber-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteProduct(product._id)}
                            className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ORDER MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Order Management</h1>
              <p className="text-gray-500 mt-1">Review active transaction packages and coordinate delivery logistics.</p>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border p-12 text-center text-gray-400 font-medium">
                No customer transactions recorded in the system.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start border-b border-gray-100 pb-3 mb-4">
                        <div>
                          <h3 className="font-extrabold text-gray-800 text-base">Order #{order._id.slice(-6)}</h3>
                          <span className="text-gray-400 text-xs block mt-0.5">Customer: {order.customerName}</span>
                        </div>
                        <span className="text-pink-600 font-black text-lg">₹{order.totalAmount}</span>
                      </div>

                      <div className="space-y-1.5 text-xs text-gray-600 mb-4">
                        <p><strong>Mobile:</strong> {order.mobile}</p>
                        <p><strong>Address:</strong> {order.address}</p>
                        <p><strong>Status:</strong> <span className="font-semibold text-pink-600">{order.status}</span></p>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-3 text-xs mb-4 space-y-2 max-h-40 overflow-y-auto">
                        <span className="font-bold text-gray-500 uppercase tracking-wider block">Purchased Items:</span>
                        {order.products?.map((item, idx) => (
                          <div key={idx} className="flex justify-between border-b last:border-0 border-gray-200 pb-1.5 last:pb-0">
                            <span><strong>{item.name}</strong> ({item.size} / {item.color})</span>
                            <span>₹{item.price} × {item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                      <label className="text-xs font-semibold text-gray-500 uppercase">Set Status:</label>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="flex-1 border rounded-lg p-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: RETURN REQUESTS */}
        {activeTab === "returns" && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Return Management</h1>
              <p className="text-gray-500 mt-1">Review items returned by buyers and coordinates reimbursement operations.</p>
            </div>

            {returns.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border p-12 text-center text-gray-400 font-medium">
                No active return queries submitted.
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-gray-600 font-semibold text-xs uppercase">
                      <th className="p-3">Order Details</th>
                      <th className="p-3">Reason</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {returns.map((item) => (
                      <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                        <td className="p-3 text-sm">
                          <span className="font-bold text-gray-800 block">ID: #{item._id.slice(-6)}</span>
                          <span className="text-xs text-gray-400 block">Order Ref: {item.orderId?._id || item.orderId}</span>
                        </td>
                        <td className="p-3 text-sm text-gray-600">{item.reason}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            item.status === "Approved" ? "bg-green-150 text-green-700" : "bg-orange-150 text-orange-700"
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <select
                            value={item.status}
                            onChange={(e) => updateReturnStatus(item._id, e.target.value)}
                            className="border border-gray-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-pink-500"
                          >
                            <option value="Requested">Requested</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}

export default Admin;