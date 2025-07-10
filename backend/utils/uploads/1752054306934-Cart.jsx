"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  CreditCard,
  Tag,
  ChevronDown,
  Lock,
  MapPin,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartItems,
  updateItemQuantity,
  removeItemFromCart,
  addItemToCart,
} from "@/redux/thunks/cartThunks";
import {
  evaluateCoupons,
  previewSingleCoupon,
} from "@/services/couponServices";
import { useRouter } from "next/navigation";
import { selectIsAuthenticated } from "../../redux/slice/userSlice";
import AddressSelection from "./AddressSelection";

export default function Cart({ isOpen, onClose }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [cartInitialized, setCartInitialized] = useState(false);
  const [couponDropdownOpen, setCouponDropdownOpen] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [couponError, setCouponError] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isAddressSelectionOpen, setIsAddressSelectionOpen] = useState(false);
  const dropdownRef = useRef(null);

  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const cartStatus = useSelector((state) => state.cart.status);
  const cartError = useSelector((state) => state.cart.error);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const hasFetchedCoupons = useRef(false);

  const fetchCoupons = async (items) => {
    setCouponsLoading(true);
    try {
      const response = await evaluateCoupons(
        items.map((item) => ({
          subProductId: item.id,
          quantity: item.quantity,
        }))
      );
      console.log("evaluateCoupons", response);
      setAvailableCoupons(response.coupons || []);
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
      setAvailableCoupons([]);
      setCouponError(error.error || error.message || "Failed to fetch coupons");
    } finally {
      setCouponsLoading(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;

    const selectedCoupon = availableCoupons.find(
      (c) => c.coupon.code.toLowerCase() === couponInput.toLowerCase()
    );

    if (!selectedCoupon) {
      setCouponError("Coupon not found");
      return;
    }

    // Check if coupon has reached max usage
    if (
      selectedCoupon.coupon.maxCouponUse &&
      selectedCoupon.coupon.useCount >= selectedCoupon.coupon.maxCouponUse
    ) {
      setCouponError("Coupon usage limit reached");
      return;
    }

    setCouponsLoading(true);
    setCouponError(null);

    try {
      // Remove previous applied coupon if it exists
      if (appliedCoupon?.giftProduct?._id) {
        setAppliedCoupon(null);
        setCouponInput("");
        await fetchCoupons(mappedCartItems);
      }

      const items = mappedCartItems.map((item) => ({
        subProductId: item.id,
        quantity: item.quantity,
      }));
      const response = await previewSingleCoupon(couponInput, items);

      if (!response.isApply) {
        setCouponError(response.reason || "Coupon is not applicable");
        return;
      }

      // Check max usage in preview response
      if (
        response.coupon.maxCouponUse &&
        response.coupon.useCount >= response.coupon.maxCouponUse
      ) {
        setCouponError("Coupon usage limit reached");
        return;
      }

      setAppliedCoupon({
        code: response.coupon.code,
        discountAmount: response.discountAmount,
        finalAmount: response.payableAmount,
        giftProduct: response.giftProduct,
      });

      setCouponInput("");
    } catch (error) {
      const errorMessage =
        error.error || error.message || "Failed to apply coupon";
      setCouponError(errorMessage);
    } finally {
      setCouponsLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    setCouponsLoading(true);
    setCouponError(null);

    try {
      // Reset coupon state
      setAppliedCoupon(null);
      setCouponInput("");

      // Fetch updated coupons
      await fetchCoupons(mappedCartItems);
    } catch (error) {
      const errorMessage =
        error.error || error.message || "Failed to remove coupon";
      setCouponError(errorMessage);
    } finally {
      setCouponsLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCouponDropdownOpen(false);
      }
    };

    if (couponDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [couponDropdownOpen]);

  const mappedCartItems =
    cartItems && Array.isArray(cartItems)
      ? cartItems.map((item, index) => {
          return {
            id: item.product_id || item._id || `item-${index}`,
            name: item.productDetails?.sku || "Unknown Product",
            price: item.productDetails?.saleingPrice || item.price || 0,
            image: item.productDetails?.image || "null",
            quantity: item.product_quantity || 0,
            category: item.productDetails?.category,
            color: [
              "bg-blue-500",
              "bg-green-500",
              "bg-yellow-400",
              "bg-blue-400",
              "bg-green-400",
              "bg-red-400",
            ][index % 6],
            isGiftProduct: false,
          };
        })
      : [];

  useEffect(() => {
    let timeout;

    if (isOpen) {
      // Reset appliedCoupon and couponInput on cart open
      setAppliedCoupon(null);
      setCouponInput("");

      dispatch(fetchCartItems())
        .unwrap()
        .then(async (cartData) => {
          // Check for gift product using localStorage
          const giftProductId = localStorage.getItem("giftProductId");
          if (giftProductId && cartData && Array.isArray(cartData)) {
            const giftProduct = cartData.find(
              (item) =>
                item.product_id === giftProductId || item._id === giftProductId
            );
            if (giftProduct) {
              try {
                await dispatch(
                  removeItemFromCart(giftProduct.product_id || giftProduct._id)
                ).unwrap();
                await dispatch(fetchCartItems()).unwrap(); // Refresh cart
                localStorage.removeItem("giftProductId"); // Clear gift product ID
              } catch (error) {
                console.error("Failed to remove gift product:", error);
              }
            }
          }

          // Fetch coupons only once per cart open
          if (
            !hasFetchedCoupons.current &&
            cartData &&
            Array.isArray(cartData)
          ) {
            try {
              const tempMappedItems = cartData.map((item, index) => ({
                id: item.product_id || item._id || `item-${index}`,
                quantity: item.product_quantity || 0,
              }));
              await fetchCoupons(tempMappedItems);
              hasFetchedCoupons.current = true;
            } catch (error) {
              console.error("Failed to fetch coupons:", error);
            }
          }

          // Initialize cart
          timeout = setTimeout(() => {
            setCartInitialized(true);
          }, 500);
        })
        .catch((error) => {
          console.error("Failed to fetch cart items:", error);
          setCartInitialized(true); // Initialize even on error
        });
    }

    return () => {
      clearTimeout(timeout);
      hasFetchedCoupons.current = false; // Reset for next cart open
    };
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    if (cartError && cartInitialized) {
      console.error("Cart error:", cartError);
    }
  }, [cartError, cartInitialized]);

  const itemCount = mappedCartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const subtotal = mappedCartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 999 ? 0 : 50;
  const total = appliedCoupon
    ? appliedCoupon.finalAmount + shipping
    : subtotal + shipping;

  const updateQuantity = async (product_id, change) => {
    const targetItem = cartItems.find((item) => item.product_id === product_id);
    if (!targetItem) {
      console.error("Target item not found:", product_id);
      return;
    }

    const newQuantity = targetItem.product_quantity + change;

    if (change > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    }

    setItemsLoading(true);
    let timeout;
    try {
      // Update quantity or remove item
      if (newQuantity <= 0) {
        await dispatch(removeItemFromCart(product_id)).unwrap();
      } else {
        await dispatch(
          updateItemQuantity({
            product_id,
            action: change > 0 ? "increment" : "decrement",
          })
        ).unwrap();
      }

      // Fetch fresh cart data
      const updatedCartData = await dispatch(fetchCartItems()).unwrap();

      // Reset coupon state
      setAppliedCoupon(null);
      setCouponInput("");

      // Map the fresh cart data
      const updatedMappedItems =
        updatedCartData && Array.isArray(updatedCartData)
          ? updatedCartData.map((item, index) => {
              return {
                id: item.product_id || item._id || `item-${index}`,
                name: item.productDetails?.sku || "Unknown Product",
                price: item.productDetails?.saleingPrice || item.price || 0,
                image: item.productDetails?.image || "null",
                quantity: item.product_quantity || 0,
                category: item.productDetails?.category,
                color: [
                  "bg-blue-500",
                  "bg-green-500",
                  "bg-yellow-400",
                  "bg-blue-400",
                  "bg-green-400",
                  "bg-red-400",
                ][index % 6],
                isGiftProduct: false,
              };
            })
          : [];

      // Fetch coupons with fresh data
      if (updatedMappedItems.length > 0) {
        await fetchCoupons(updatedMappedItems);
      } else {
        setAvailableCoupons([]);
      }
    } catch (error) {
      console.error("Failed to update cart:", error);
    } finally {
      timeout = setTimeout(() => setItemsLoading(false), 500);
    }

    return () => clearTimeout(timeout);
  };

  const isUnauthorized =
    !isAuthenticated ||
    cartStatus === "failed" ||
    cartItems === null ||
    (cartError &&
      (cartError.status === 401 ||
        cartError.message?.toLowerCase().includes("unauthorized")));

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Cart Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full md:w-96 lg:w-[28rem] z-[1000] flex flex-col"
          >
            {/* Cart Header */}
            <motion.div
              style={{
                background:
                  "linear-gradient(to right, #cffafe 0%, #ffffff 50%, #cffafe 100%)",
              }}
              className="text-white p-5 shadow-lg"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex justify-between items-center">
                <motion.div
                  className="flex items-center space-x-3"
                  whileHover={{ scale: 1.03 }}
                >
                  <motion.div
                    animate={{
                      rotate: [0, -10, 10, -5, 5, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  >
                    <ShoppingBag size={28} className="text-green-300" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-indigo-900">Cart</h2>
                  {!isUnauthorized && (
                    <motion.div
                      className="bg-green-400 text-black text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      {itemCount}
                    </motion.div>
                  )}
                </motion.div>

                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-full bg-green-500 hover:bg-green-400 text-white transition-colors"
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </div>
            </motion.div>

            {/* Cart Items Container */}
            <div className="flex-grow overflow-auto bg-white shadow-inner">
              {!cartInitialized ? (
                <div className="relative h-full">
                  <motion.div
                    className="flex flex-col items-center justify-center h-full p-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="border-4 border-green-400 border-t-transparent rounded-full w-12 h-12"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <p className="mt-4 text-green-700 font-medium">
                      Loading cart...
                    </p>
                  </motion.div>
                </div>
              ) : isUnauthorized ? (
                <motion.div
                  className="flex flex-col items-center justify-center h-full p-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="bg-green-100 p-6 rounded-full mb-4">
                    <Lock size={60} className="text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-green-700 mb-2">
                    Authorization Required
                  </h3>
                  <p className="text-green-500 mb-6">
                    Please log in to view your cart
                  </p>
                  <motion.button
                    className="bg-gradient-to-r from-blue-500 to-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.4)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onClose();
                      router.push("/login");
                    }}
                  >
                    Log In
                  </motion.button>
                </motion.div>
              ) : mappedCartItems.length === 0 &&
                !appliedCoupon?.giftProduct ? (
                <motion.div
                  className="flex flex-col items-center justify-center h-full p-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="bg-green-100 p-6 rounded-full mb-4">
                    <ShoppingBag size={60} className="text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-green-700 mb-2">
                    Your cart is empty!
                  </h3>
                  <p className="text-green-500 mb-6">
                    Let's fill it with sweet treats
                  </p>
                  <motion.button
                    className="bg-gradient-to-r from-blue-500 to-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.4)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onClose();
                      router.push("/products");
                    }}
                  >
                    Shop Now
                  </motion.button>
                </motion.div>
              ) : (
                <div className="relative">
                  <motion.ul
                    className="p-4 space-y-4"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1,
                        },
                      },
                    }}
                  >
                    {appliedCoupon?.giftProduct && (
                      <motion.li
                        className="rounded-xl overflow-hidden shadow-md border-2 border-green-100 relative"
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 },
                        }}
                        layout
                      >
                        <div className="absolute top-0 left-0 w-2 h-full bg-green-500"></div>
                        <div className="p-3 pl-4 flex items-center">
                          <motion.div
                            className="mr-3 rounded-lg overflow-hidden bg-green-50 flex-shrink-0"
                            whileHover={{
                              y: [0, -5, 0],
                              transition: { duration: 0.5 },
                            }}
                          >
                            <img
                              src={appliedCoupon.giftProduct.image || "null"}
                              alt={appliedCoupon.giftProduct.sku}
                              className="w-16 h-16 object-cover"
                            />
                          </motion.div>
                          <div className="flex-grow">
                            <h3 className="font-bold text-green-800">
                              {appliedCoupon.giftProduct.sku}
                              <span className="text-sm text-green-500 ml-2">
                                (Gift)
                              </span>
                            </h3>
                            <div className="flex justify-between items-center mt-1">
                              <p className="text-blue-600 font-bold">FREE</p>
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-green-800 w-6 text-center">
                                  1
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-green-500 mt-1">
                              Total: <span className="font-bold">₹0.00</span>
                            </p>
                          </div>
                        </div>
                      </motion.li>
                    )}
                    {mappedCartItems.map((item) => (
                      <AnimatePresence key={item.id}>
                        {!item.removing && (
                          <motion.li
                            className={`rounded-xl overflow-hidden shadow-md border-2 border-green-100 relative group`}
                            variants={{
                              hidden: { opacity: 0, y: 20 },
                              visible: { opacity: 1, y: 0 },
                            }}
                            exit={{
                              opacity: 0,
                              x: 300,
                              scale: 0.8,
                              transition: { duration: 0.3 },
                            }}
                            layout
                          >
                            <div
                              className={`absolute top-0 left-0 w-2 h-full ${item.color}`}
                            ></div>

                            <div className="p-3 pl-4 flex items-center">
                              <motion.div
                                className="mr-3 rounded-lg overflow-hidden bg-green-50 flex-shrink-0"
                                whileHover={{
                                  y: [0, -5, 0],
                                  transition: { duration: 0.5 },
                                }}
                              >
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-16 h-16 object-cover"
                                />
                              </motion.div>

                              <div className="flex-grow">
                                <h3 className="font-bold text-green-800">
                                  {item.name}
                                </h3>
                                <div className="flex justify-between items-center mt-1">
                                  <p className="text-blue-600 font-bold">
                                    {item.price === 0
                                      ? "FREE"
                                      : `₹${item.price.toFixed(2)}`}
                                  </p>

                                  <div className="flex items-center space-x-2">
                                    <>
                                      <motion.button
                                        onClick={() =>
                                          updateQuantity(item.id, -1)
                                        }
                                        className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-700 hover:bg-green-200"
                                        whileTap={{ scale: 0.8 }}
                                      >
                                        <Minus size={14} />
                                      </motion.button>

                                      <span className="font-bold text-green-800 w-6 text-center">
                                        {item.quantity}
                                      </span>

                                      <motion.button
                                        onClick={() =>
                                          updateQuantity(item.id, 1)
                                        }
                                        className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-700 hover:bg-green-200"
                                        whileTap={{ scale: 0.8 }}
                                      >
                                        <Plus size={14} />
                                      </motion.button>
                                    </>
                                  </div>
                                </div>

                                <p className="text-sm text-green-500 mt-1">
                                  Total:{" "}
                                  <span className="font-bold">
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                  </span>
                                </p>
                              </div>

                              <motion.button
                                className="ml-2 p-2 opacity-0 group-hover:opacity-100 md:opacity-100 text-red-500 hover:text-red-600"
                                onClick={() =>
                                  updateQuantity(item.id, -item.quantity)
                                }
                                whileHover={{ scale: 1.2, rotate: 20 }}
                                whileTap={{ scale: 0.8 }}
                              >
                                <Trash2 size={20} />
                              </motion.button>
                            </div>
                          </motion.li>
                        )}
                      </AnimatePresence>
                    ))}
                  </motion.ul>

                  <AnimatePresence>
                    {itemsLoading && (
                      <motion.div
                        className="fixed top-20 right-30 -translate-x-1/2 bg-white/90 backdrop-blur-sm flex flex-col items-center z-[1001] px-4 py-2 rounded-md shadow-lg border border-green-200"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.div
                          className="border-4 border-green-400 border-t-transparent rounded-full w-6 h-6"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        <p className="mt-1 text-green-700 font-medium text-sm">
                          Updating...
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cartInitialized && !isUnauthorized && (
              <motion.div className="bg-gradient-to-r from-green-50 to-green-100 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                {mappedCartItems.length > 0 || appliedCoupon?.giftProduct ? (
                  <>
                    <div className="p-4 bg-white rounded-xl shadow-sm mb-4">
                      <div className="space-y-3">
                        <div className="flex justify-between text-green-700">
                          <span>Subtotal</span>
                          <span className="font-bold">
                            ₹{subtotal.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex justify-between text-green-700">
                          <span>Shipping</span>
                          <span className="font-bold">
                            {shipping === 0 ? (
                              <span className="text-green-500">FREE</span>
                            ) : (
                              `₹${shipping.toFixed(2)}`
                            )}
                          </span>
                        </div>

                        {shipping > 0 && subtotal > 0 && (
                          <div className="text-sm text-green-500 italic">
                            Add ₹{(999 - subtotal).toFixed(2)} more for free
                            delivery
                          </div>
                        )}
                        {shipping === 0 && subtotal > 0 && (
                          <div className="text-sm text-green-500 italic">
                            Free delivery unlocked!
                          </div>
                        )}

                        {/* Coupons Section */}
                        {!couponsLoading && availableCoupons.length > 0 && (
                          <div className="mb-4 space-y-1">
                            {availableCoupons.filter((c) => c.isApply)
                              .length === 1 ? (
                              (() => {
                                const coupon = availableCoupons[0];
                                const isApplicable =
                                  coupon.isApply &&
                                  coupon.coupon.useCount <
                                    coupon.coupon.maxCouponUse;
                                return (
                                  <div
                                    key={coupon.coupon._id}
                                    className={`p-2 rounded-md flex justify-between items-center transition-all duration-200 ${
                                      isApplicable
                                        ? "bg-green-50 hover:bg-green-100 cursor-pointer"
                                        : "bg-gray-100 opacity-70 cursor-not-allowed"
                                    }`}
                                    onClick={() =>
                                      isApplicable &&
                                      setCouponInput(coupon.coupon.code)
                                    }
                                  >
                                    <div className="flex-1">
                                      <p
                                        className={`font-semibold text-sm ${
                                          isApplicable
                                            ? "text-green-800"
                                            : "text-gray-600"
                                        }`}
                                      >
                                        {coupon.coupon.code}
                                      </p>
                                      <p
                                        className={`text-xs ${
                                          isApplicable
                                            ? "text-green-600"
                                            : "text-gray-500"
                                        }`}
                                      >
                                        {coupon.coupon.discountType ===
                                        "percentage"
                                          ? `${coupon.coupon.discountValue}% off`
                                          : coupon.coupon.discountType ===
                                            "flat"
                                          ? `₹${coupon.coupon.discountValue} off`
                                          : `Free ${
                                              coupon.giftProduct?.sku ||
                                              "Gift Product"
                                            }`}
                                      </p>
                                      <p
                                        className={`text-xs ${
                                          isApplicable
                                            ? "text-green-500"
                                            : "text-gray-500"
                                        }`}
                                      >
                                        Min purchase: ₹
                                        {coupon.coupon.min_Purchase_Amount}
                                      </p>
                                      {!isApplicable && (
                                        <p className="text-xs text-red-500">
                                          {coupon.reason ||
                                            "Coupon usage limit reached"}
                                        </p>
                                      )}
                                    </div>
                                    <motion.button
                                      className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                                        isApplicable
                                          ? "bg-green-600 hover:bg-green-700 text-white"
                                          : "bg-gray-400 text-gray-200 cursor-not-allowed"
                                      }`}
                                      whileHover={
                                        isApplicable ? { scale: 1.05 } : {}
                                      }
                                      whileTap={
                                        isApplicable ? { scale: 0.95 } : {}
                                      }
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (isApplicable) {
                                          navigator.clipboard.writeText(
                                            coupon.coupon.code
                                          );
                                        }
                                      }}
                                      disabled={!isApplicable}
                                    >
                                      Copy
                                    </motion.button>
                                  </div>
                                );
                              })()
                            ) : (
                              <div className="relative" ref={dropdownRef}>
                                <motion.button
                                  className="w-full flex items-center justify-between p-2 bg-green-50 rounded-md text-green-800 font-medium text-sm"
                                  onClick={() =>
                                    setCouponDropdownOpen(!couponDropdownOpen)
                                  }
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <span>
                                    {couponInput || "Available Coupons"}
                                  </span>
                                  <ChevronDown
                                    size={16}
                                    className={`transform transition-transform ${
                                      couponDropdownOpen ? "rotate-180" : ""
                                    }`}
                                  />
                                </motion.button>

                                <AnimatePresence>
                                  {couponDropdownOpen && (
                                    <motion.div
                                      initial={{ opacity: 0, y: -10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      transition={{ duration: 0.2 }}
                                      className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-green-100 max-h-[160px] overflow-y-auto"
                                    >
                                      {availableCoupons.map((coupon) => {
                                        const isApplicable =
                                          coupon.isApply &&
                                          coupon.coupon.useCount <
                                            coupon.coupon.maxCouponUse;
                                        return (
                                          <div
                                            key={coupon.coupon._id}
                                            className={`p-2 flex justify-between items-center transition-all duration-200 ${
                                              isApplicable
                                                ? "hover:bg-green-50 cursor-pointer"
                                                : "bg-gray-50 opacity-70 cursor-not-allowed"
                                            }`}
                                            onClick={() => {
                                              if (isApplicable) {
                                                setCouponInput(
                                                  coupon.coupon.code
                                                );
                                                setCouponDropdownOpen(false);
                                              }
                                            }}
                                          >
                                            <div className="flex-1">
                                              <p
                                                className={`font-semibold text-sm ${
                                                  isApplicable
                                                    ? "text-green-800"
                                                    : "text-gray-600"
                                                }`}
                                              >
                                                {coupon.coupon.code}
                                              </p>
                                              <p
                                                className={`text-xs ${
                                                  isApplicable
                                                    ? "text-green-600"
                                                    : "text-gray-500"
                                                }`}
                                              >
                                                {coupon.coupon.discountType ===
                                                "percentage"
                                                  ? `${coupon.coupon.discountValue}% off`
                                                  : coupon.coupon
                                                      .discountType === "flat"
                                                  ? `₹${coupon.coupon.discountValue} off`
                                                  : `Free ${
                                                      coupon.giftProduct?.sku ||
                                                      "Gift Product"
                                                    }`}
                                              </p>
                                              <p
                                                className={`text-xs ${
                                                  isApplicable
                                                    ? "text-green-500"
                                                    : "text-gray-500"
                                                }`}
                                              >
                                                Min purchase: ₹
                                                {
                                                  coupon.coupon
                                                    .min_Purchase_Amount
                                                }
                                              </p>
                                              {!isApplicable && (
                                                <p className="text-xs text-red-500">
                                                  {coupon.reason ||
                                                    "Coupon usage limit reached"}
                                                </p>
                                              )}
                                            </div>
                                            <motion.button
                                              className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                                                isApplicable
                                                  ? "bg-green-600 hover:bg-green-700 text-white"
                                                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
                                              }`}
                                              whileHover={
                                                isApplicable
                                                  ? { scale: 1.05 }
                                                  : {}
                                              }
                                              whileTap={
                                                isApplicable
                                                  ? { scale: 0.95 }
                                                  : {}
                                              }
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (isApplicable) {
                                                  navigator.clipboard.writeText(
                                                    coupon.coupon.code
                                                  );
                                                  setCouponDropdownOpen(false);
                                                }
                                              }}
                                              disabled={!isApplicable}
                                            >
                                              Copy
                                            </motion.button>
                                          </div>
                                        );
                                      })}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}

                            {/* Coupon Input Field */}
                            <div className="flex mt-2">
                              <input
                                type="text"
                                value={couponInput}
                                onChange={(e) => setCouponInput(e.target.value)}
                                placeholder="Enter coupon code"
                                className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              />
                              <button
                                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-r-md font-medium text-sm transition-colors duration-200 flex items-center justify-center min-w-20"
                                onClick={handleApplyCoupon}
                                disabled={couponsLoading || !couponInput.trim()}
                              >
                                {couponsLoading ? (
                                  <motion.div
                                    className="border-2 border-white border-t-transparent rounded-full w-4 h-4"
                                    animate={{ rotate: 360 }}
                                    transition={{
                                      duration: 1,
                                      repeat: Infinity,
                                      ease: "linear",
                                    }}
                                  />
                                ) : (
                                  "Apply"
                                )}
                              </button>
                            </div>

                            {/* Error Display */}
                            {couponError && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md"
                              >
                                <p className="text-red-600 text-xs font-medium flex items-center">
                                  <X size={12} className="mr-1" />
                                  {couponError}
                                </p>
                              </motion.div>
                            )}

                            {/* Success Display */}
                            {appliedCoupon && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md"
                              >
                                <p className="text-green-600 text-xs font-medium flex items-center justify-between">
                                  <span className="flex items-center">
                                    <Tag size={12} className="mr-1" />
                                    Coupon {appliedCoupon.code} applied!
                                  </span>
                                  <span className="flex items-center space-x-2">
                                    {appliedCoupon.discountAmount > 0 && (
                                      <span className="font-bold">
                                        -₹
                                        {appliedCoupon.discountAmount.toFixed(
                                          2
                                        )}
                                      </span>
                                    )}
                                    {appliedCoupon.giftProduct && (
                                      <span className="font-bold">
                                        Free {appliedCoupon.giftProduct.sku}
                                      </span>
                                    )}
                                    <motion.button
                                      className="p-1 rounded-full bg-green-700 hover:bg-green-600 text-white"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={handleRemoveCoupon}
                                    >
                                      <X size={12} />
                                    </motion.button>
                                  </span>
                                </p>
                              </motion.div>
                            )}
                          </div>
                        )}

                        {/* Loading state for coupons */}
                        {couponsLoading && (
                          <div className="mb-4 space-y-1">
                            <div className="flex items-center text-gray-800">
                              <Tag className="h-4 w-4 mr-2 text-green-600" />
                              <span className="font-medium text-sm">
                                Loading Coupons...
                              </span>
                            </div>
                            <div className="flex items-center justify-center p-2 bg-green-50 rounded-md">
                              <motion.div
                                className="border-2 border-green-400 border-t-transparent rounded-full w-4 h-4"
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="pt-2 border-t border-green-100">
                          <div className="flex justify-between text-lg font-bold text-green-800">
                            <span>Total</span>
                            <motion.span
                              key={total}
                              initial={{ scale: 1.2 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              ₹{total.toFixed(2)}
                            </motion.span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <motion.button
                        className="w-full bg-gradient-to-r from-blue-500 to-green-600 text-white font-bold py-3 px-6 rounded-full shadow-md flex items-center justify-center space-x-2"
                        whileHover={{
                          scale: 1.03,
                          boxShadow: "0 10px 25px -5px rgba(147, 51, 234, 0.5)",
                        }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsAddressSelectionOpen(true)}
                      >
                        <span>Select Address</span>
                        <MapPin size={20} />
                      </motion.button>
                      <AddressSelection
                        isOpen={isAddressSelectionOpen}
                        onClose={() => setIsAddressSelectionOpen(false)}
                        appliedCoupon={appliedCoupon}
                      />
                    </div>
                  </>
                ) : null}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && isOpen && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-50"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {Array.from({ length: 50 }).map((_, i) => {
              const size = Math.random() * 10 + 5;
              const color = [
                "bg-blue-500",
                "bg-green-500",
                "bg-yellow-400",
                "bg-blue-400",
                "bg-green-400",
                "bg-red-400",
              ][Math.floor(Math.random() * 6)];

              return (
                <motion.div
                  key={i}
                  className={`absolute rounded-md ${color}`}
                  style={{
                    width: size,
                    height: size,
                    top: `calc(40% + ${Math.random() * 30}%)`,
                    left: `calc(80% + ${Math.random() * 15 - 7.5}%)`,
                  }}
                  initial={{
                    y: -20,
                    x: 0,
                    rotate: Math.random() * 360,
                    opacity: 1,
                  }}
                  animate={{
                    y: Math.random() * 400 + 150,
                    x: (Math.random() - 0.5) * 200,
                    rotate:
                      Math.random() * 360 * (Math.random() > 0.5 ? 1 : -1),
                    opacity: 0,
                  }}
                  transition={{
                    duration: 1 + Math.random() * 0.5,
                    ease: "easeOut",
                  }}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
