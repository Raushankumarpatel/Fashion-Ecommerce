import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function Login() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    if (isSignUp && !name) {
      setErrorMsg("Please enter your name.");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Register API call
        const res = await API.post("/auth/register", {
          name,
          email,
          password,
          role,
        });

        setSuccessMsg("Registration successful! Logging you in...");
        
        // Auto login
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        setTimeout(() => {
          redirectUser(res.data.user.role);
        }, 1500);
      } else {
        // Login API call
        const res = await API.post("/auth/login", {
          email,
          password,
        });

        setSuccessMsg("Login successful!");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        setTimeout(() => {
          redirectUser(res.data.user.role);
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Something went wrong. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const redirectUser = (userRole) => {
    if (userRole === "admin") {
      navigate("/admin");
    } else if (userRole === "seller") {
      navigate("/seller");
    } else {
      navigate("/");
    }
    // Refresh page to sync navbar links
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-900 via-pink-600 to-red-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/95 backdrop-blur-md p-10 rounded-3xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900">
            Fashion Store
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isSignUp ? "Create a new account" : "Sign in to your account"}
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => {
              setIsSignUp(false);
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`flex-1 pb-4 text-center font-bold border-b-2 text-lg transition-all ${
              !isSignUp ? "border-pink-500 text-pink-600" : "border-transparent text-gray-400"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setIsSignUp(true);
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`flex-1 pb-4 text-center font-bold border-b-2 text-lg transition-all ${
              isSignUp ? "border-pink-500 text-pink-600" : "border-transparent text-gray-400"
            }`}
          >
            Sign Up
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-center font-medium border border-red-200">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-center font-medium border border-green-200">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all"
              />
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Account Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none bg-white transition-all"
                >
                  <option value="customer">Customer (Buyer)</option>
                  <option value="seller">Seller (Merchant)</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all cursor-pointer"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
              ) : isSignUp ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
