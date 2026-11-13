import { Link } from "react-router-dom";
import CartPanel from "../components/CartPanel";
import { useCart } from "../lib/cart";

export default function CartPage() {
  const { itemCount } = useCart();

  return (
    <div className="min-h-screen bg-secondary-off-white pb-16 pt-6">
      <div className="o-container mx-auto max-w-lg">
        <p className="eyebrow">سبد خرید</p>
        <h1 className="mt-2 text-h-4xl text-brand-indigo">خلاصه سفارش</h1>
        <p className="mt-2 text-sm text-neutral-600">{itemCount} قلم در سبد شماست.</p>

        <div className="mt-8">
          <CartPanel />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/shop" className="text-sm font-bold text-brand-indigo underline">
            ادامه خرید
          </Link>
          <Link to="/subscriptions" className="text-sm font-bold text-brand-orange-hot underline">
            مشاهده اشتراک‌ها
          </Link>
        </div>
      </div>
    </div>
  );
}
