export const readStoredArray = (key) => {
  if (typeof window === "undefined") return [];
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error(`Failed to read ${key}:`, error);
    return [];
  }
};

export const saveStoredArray = (key, value) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
};

export const getCartItems = () => readStoredArray("cart");
export const getWishlistItems = () => readStoredArray("wishlist");

export const getCartCount = () => {
  return getCartItems().reduce((sum, item) => sum + (item.quantity || 1), 0);
};

export const getCartTotal = (items = getCartItems()) => {
  return items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
};
