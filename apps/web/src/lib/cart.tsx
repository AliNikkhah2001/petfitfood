import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "../data/catalog";

export type CartLine = {
  productId: string;
  grams: number;
  unitPrice: number;
  qty: number;
  nameFa: string;
  image: string;
};

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  totalToman: number;
  addItem: (product: Product, grams: number) => void;
  setQty: (productId: string, grams: number, qty: number) => void;
  removeLine: (productId: string, grams: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const CART_STORAGE_KEY = "petfit-cart-v1";

function lineKey(productId: string, grams: number) {
  return `${productId}:${grams}`;
}

function readStoredLines(): CartLine[] {
  try {
    const raw = sessionStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (row): row is CartLine =>
        !!row &&
        typeof row === "object" &&
        typeof (row as CartLine).productId === "string" &&
        typeof (row as CartLine).grams === "number" &&
        typeof (row as CartLine).unitPrice === "number" &&
        typeof (row as CartLine).qty === "number",
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => readStoredLines());

  useEffect(() => {
    try {
      sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore quota */
    }
  }, [lines]);

  const addItem = useCallback((product: Product, grams: number) => {
    const price = product.prices.find((p) => p.grams === grams);
    if (!price) return;
    setLines((prev) => {
      const key = lineKey(product.id, grams);
      const existing = prev.find((l) => lineKey(l.productId, l.grams) === key);
      if (existing) {
        return prev.map((l) =>
          lineKey(l.productId, l.grams) === key ? { ...l, qty: l.qty + 1 } : l,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          grams,
          unitPrice: price.priceToman,
          qty: 1,
          nameFa: product.nameFa,
          image: product.image,
        },
      ];
    });
  }, []);

  const setQty = useCallback((productId: string, grams: number, qty: number) => {
    setLines((prev) => {
      if (qty < 1) {
        return prev.filter((l) => !(l.productId === productId && l.grams === grams));
      }
      return prev.map((l) =>
        l.productId === productId && l.grams === grams ? { ...l, qty } : l,
      );
    });
  }, []);

  const removeLine = useCallback((productId: string, grams: number) => {
    setLines((prev) => prev.filter((l) => !(l.productId === productId && l.grams === grams)));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const totalToman = useMemo(
    () => lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0),
    [lines],
  );
  const itemCount = useMemo(() => lines.reduce((sum, l) => sum + l.qty, 0), [lines]);

  const value = useMemo(
    () => ({ lines, itemCount, totalToman, addItem, setQty, removeLine, clear }),
    [lines, itemCount, totalToman, addItem, setQty, removeLine, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
