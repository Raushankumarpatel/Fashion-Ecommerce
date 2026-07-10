import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import OrderTracking from "./pages/OrderTracking";
import Returns from "./pages/Returns";
import CustomerPortal from "./pages/CustomerPortal";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import SellerDashboard from "./pages/SellerDashboard";

import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/track" element={<OrderTracking />} />
        <Route path="/orders" element={<OrderTracking />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/customer" element={<CustomerPortal />} />
        <Route path="/portal" element={<CustomerPortal />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/seller" element={<SellerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;