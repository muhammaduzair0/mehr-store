"use client";

import { useSyncExternalStore } from "react";

function createFlagStore() {
  let value = false;
  const listeners = new Set<() => void>();
  return {
    set(v: boolean) {
      value = v;
      listeners.forEach((fn) => fn());
    },
    subscribe(fn: () => void) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    getSnapshot: () => value,
    getServerSnapshot: () => false,
  };
}

const drawerStore = createFlagStore();
const menuStore = createFlagStore();

export const CartDrawerUI = {
  open: () => drawerStore.set(true),
  close: () => drawerStore.set(false),
};

export const MobileMenuUI = {
  open: () => menuStore.set(true),
  close: () => menuStore.set(false),
};

export function useCartDrawerOpen(): boolean {
  return useSyncExternalStore(drawerStore.subscribe, drawerStore.getSnapshot, drawerStore.getServerSnapshot);
}

export function useMobileMenuOpen(): boolean {
  return useSyncExternalStore(menuStore.subscribe, menuStore.getSnapshot, menuStore.getServerSnapshot);
}
