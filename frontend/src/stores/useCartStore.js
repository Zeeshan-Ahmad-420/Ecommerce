import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      coupon: null,
      subtotal: 0,
      total: 0,
      isCouponApplied: false,

      getMyCoupon: async () => {
        try {
          await axios.get("/coupon");
          set({ coupon: null })
        } catch (error) {
          console.log("Error fetching coupon", error);
        }
      },

      applyCoupon: async (code) => {
        try {
          const response = await axios.post("/coupon/validate", { code });
          set({ coupon: response.data, isCouponApplied: true });
          get().calculateTotals();
          toast.success("Coupon applied successfully");
        } catch (error) {
          toast.error(error.response?.data?.message || "Coupon validation failed");
        }
      },

      removeCoupon: () => {
        set({ coupon: null, isCouponApplied: false });
        get().calculateTotals();
        toast.success("Coupon removed successfully");
      },

      getCartItems: async () => {
        try {
          const res = await axios.get("/cart");
          set({ cart: res.data });
          get().calculateTotals();
        } catch (err) {
          set({ cart: [] });
          toast.error(err.response?.data?.message || "Failed to fetch cart");
        }
      },

      addToCart: async (product) => {
        try {
          await axios.post("/cart", { productId: product._id });
          toast.success("Added to cart");
          get().getCartItems();
        } catch (err) {
          toast.error(err.response?.data?.message || "Add failed");
        }
      },

      removeFromCart: async (productId) => {
        try {
          await axios.delete("/cart", { data: { productId } });
          toast.success("Removed from cart");
          get().getCartItems();
        } catch (err) {
          toast.error(err.response?.data?.message || "Remove failed");
        }
      },

      updateQuantity: async (productId, quantity) => {
        try {
          await axios.put(`/cart/${productId}`, { quantity });
          toast.success("Updated quantity");
          get().getCartItems();
        } catch (err) {
          toast.error(err.response?.data?.message || "Update failed");
        }
      },

      clearCart: () =>
        set({ cart: [], coupon: null, subtotal: 0, total: 0, isCouponApplied: false }),

      calculateTotals: () => {
        const { cart, coupon, isCouponApplied } = get();
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const total =
          isCouponApplied && coupon
            ? subtotal * (1 - coupon.discountPercentage / 100)
            : subtotal;
        set({ subtotal, total });
      },
    }),
    { name: "cart-storage" }
  )
);
