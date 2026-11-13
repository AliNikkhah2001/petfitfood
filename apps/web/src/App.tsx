import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { CartProvider } from "./lib/cart";
import CheckoutPage from "./pages/CheckoutPage";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div id="top" dir="rtl" lang="fa-IR" className="petfit-site min-h-screen bg-white">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[100] focus:rounded-full focus:bg-brand-indigo focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
          >
            رفتن به محتوای اصلی
          </a>
          <Header />
          <main
            id="main-content"
            style={{ paddingTop: "var(--petfit-header-height, 108px)" }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}
