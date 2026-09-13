
Action: file_editor create /app/frontend/src/App.js;
import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";

function App() {
  return (
    <div className="App font-body">
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main>
              <Routes>
                <Route path="/\" element={<Home />} />
                <Route path="/products\" element={<Products />} />
                <Route path="/products/:id\" element={<ProductDetail />} />
                <Route path="/cart\" element={<Cart />} />
                <Route path="/checkout\" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/checkout/success\" element={<Success />} />
                <Route path="/orders\" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="/wishlist\" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                <Route path="/login\" element={<Login />} />
                <Route path="/register\" element={<Register />} />
                <Route path="/admin\" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
              </Routes>
            </main>
            <Footer />
            <Toaster position="top-center\" richColors />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
" Observation: Overwrite successful: /app/frontend/src/App.js"