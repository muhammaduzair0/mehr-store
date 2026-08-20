"use client";

import { useSyncExternalStore } from "react";

export type CartItem = {
  key: string;
  id: string;
  /** WooCommerce variation id, when this line is a specific size of a variable product. */
  variationId: number | null;
  name: string;
  cat: string;
  type: string;
  ml: number | null;
  price: number;
  qty: number;
  image: string | null;
};

export type Order = {
  no: string;
  date: number;
  email: string;
  total: number;
  status: string;
  items: CartItem[];
};

export type User = { name: string; email: string };
export type Address = {
  fn?: string;
  ln?: string;
  addr?: string;
  city?: string;
  zip?: string;
  country?: string;
};

/* ---------------- generic localStorage-backed store ---------------- */

function createLocalStore<T>(key: string, fallback: T) {
  let cache: T = fallback;
  let hydrated = false;
  const listeners = new Set<() => void>();

  function read(): T {
    if (typeof window === "undefined") return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  function ensureHydrated() {
    if (hydrated || typeof window === "undefined") return;
    hydrated = true;
    cache = read();
  }

  function set(value: T) {
    cache = value;
    hydrated = true;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
    listeners.forEach((fn) => fn());
  }

  function subscribe(fn: () => void) {
    listeners.add(fn);
    if (typeof window !== "undefined") {
      const onStorage = (e: StorageEvent) => {
        if (e.key === key) {
          cache = read();
          fn();
        }
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(fn);
        window.removeEventListener("storage", onStorage);
      };
    }
    return () => listeners.delete(fn);
  }

  function getSnapshot(): T {
    ensureHydrated();
    return cache;
  }

  function getServerSnapshot(): T {
    return fallback;
  }

  return { get: getSnapshot, set, subscribe, getSnapshot, getServerSnapshot };
}

/* ---------------- store instances ---------------- */

const cartStore   = createLocalStore<CartItem[]>("mehr_cart_v1", []);
const wishStore   = createLocalStore<string[]>("mehr_wish_v1", []);
const ordersStore = createLocalStore<Order[]>("mehr_orders_v1", []);
const userStore   = createLocalStore<User | null>("mehr_user", null);
const addrStore   = createLocalStore<Address>("mehr_addr", {});

/* ---------------- Cart ---------------- */

export const Cart = {
  items: () => cartStore.get(),
  count: () => cartStore.get().reduce((n, i) => n + i.qty, 0),
  subtotal: () => cartStore.get().reduce((s, i) => s + i.price * i.qty, 0),

  addWC(
    product: { id: number; name: string; price: string; categories?: { name: string; slug: string }[]; images?: { src: string }[] },
    qty = 1,
    variation?: { id: number; price: string; image?: string | null; sizeLabel?: string | null }
  ) {
    const cart = cartStore.get().slice();
    const key  = variation ? `${product.id}:${variation.id}` : String(product.id);
    const existing = cart.find((i) => i.key === key);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        key,
        id:          String(product.id),
        variationId: variation?.id ?? null,
        name:        product.name,
        cat:         product.categories?.[0]?.name || "",
        type:        "Eau de Parfum",
        ml:          variation?.sizeLabel ? parseFloat(variation.sizeLabel) || null : null,
        price:       parseFloat(variation?.price ?? product.price) || 0,
        qty,
        image:       variation?.image || product.images?.[0]?.src || null,
      });
    }
    cartStore.set(cart);
  },

  setQty(key: string, qty: number) {
    let cart = cartStore.get().slice();
    const it = cart.find((i) => i.key === key);
    if (!it) return;
    it.qty = qty;
    if (it.qty <= 0) cart = cart.filter((i) => i.key !== key);
    cartStore.set(cart);
  },

  remove(key: string) {
    cartStore.set(cartStore.get().filter((i) => i.key !== key));
  },

  clear() {
    cartStore.set([]);
  },
};

/* ---------------- Wishlist ---------------- */

export const Wish = {
  items: () => wishStore.get(),
  has: (id: string) => wishStore.get().includes(id),
  count: () => wishStore.get().length,
  toggle(id: string) {
    const a = wishStore.get().slice();
    const i = a.indexOf(id);
    if (i >= 0) a.splice(i, 1);
    else a.unshift(id);
    wishStore.set(a);
    return a.includes(id);
  },
  remove(id: string) {
    wishStore.set(wishStore.get().filter((x) => x !== id));
  },
};

/* ---------------- Orders ---------------- */

export const Orders = {
  all: () => ordersStore.get(),
  add(order: Order) {
    ordersStore.set([order, ...ordersStore.get()]);
  },
};

/* ---------------- User / auth ---------------- */

export const Auth = {
  user: () => userStore.get(),
  setUser: (u: User | null) => userStore.set(u),
  signOut: () => userStore.set(null),
};

export const AddressBook = {
  get: () => addrStore.get(),
  set: (a: Address) => addrStore.set(a),
};

/* ---------------- hooks ---------------- */

export function useCart(): CartItem[] {
  return useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
}

export function useWishlist(): string[] {
  return useSyncExternalStore(wishStore.subscribe, wishStore.getSnapshot, wishStore.getServerSnapshot);
}

export function useOrders(): Order[] {
  return useSyncExternalStore(ordersStore.subscribe, ordersStore.getSnapshot, ordersStore.getServerSnapshot);
}

export function useUser(): User | null {
  return useSyncExternalStore(userStore.subscribe, userStore.getSnapshot, userStore.getServerSnapshot);
}

export function useAddress(): Address {
  return useSyncExternalStore(addrStore.subscribe, addrStore.getSnapshot, addrStore.getServerSnapshot);
}

