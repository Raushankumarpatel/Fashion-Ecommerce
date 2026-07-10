import { useEffect, useState } from "react";
import API from "../api/api";

function OrderTracking() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await API.get("/orders");
    setOrders(res.data);
  };

  const statusColor = (status) => {
    if (status === "Pending") return "bg-yellow-100 text-yellow-700";
    if (status === "Processing") return "bg-blue-100 text-blue-700";
    if (status === "Shipped") return "bg-purple-100 text-purple-700";
    if (status === "Delivered") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-8">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-xl text-gray-500">
          No orders found
        </p>
      ) : (
        <div className="max-w-5xl mx-auto space-y-5">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  Order #{order._id.slice(-6)}
                </h2>

                <span
                  className={`px-4 py-1 rounded-full font-semibold ${statusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              <p className="mt-3">
                <strong>Name:</strong> {order.customerName}
              </p>

              <p>
                <strong>Mobile:</strong> {order.mobile}
              </p>

              <p>
                <strong>Address:</strong> {order.address}
              </p>

              <p className="text-pink-600 font-bold text-xl mt-3">
                Total: ₹{order.totalAmount}
              </p>

              <div className="mt-4">
                <h3 className="font-bold mb-2">Products:</h3>

                {order.products?.map((item, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-3 mb-2 bg-gray-50"
                  >
                    <p>{item.name}</p>
                    <p>₹{item.price} × {item.quantity}</p>
                    <p>Size: {item.size}</p>
                    <p>Color: {item.color}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderTracking;