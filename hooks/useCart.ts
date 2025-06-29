import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CartItem {
  id: string;
  name: string;
  price: number;
  provider: string;
  duration: number;
  category: string;
  quantity: number;
  prescriptionId?: string; // For prescription medications
}

const CART_STORAGE_KEY = '@afyabora_cart';

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from storage on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveCart();
    }
  }, [cartItems, isLoading]);

  const loadCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
  };

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const addPrescriptionToCart = (prescriptionItem: Omit<CartItem, 'quantity'>) => {
    // For prescriptions, we don't increment quantity if it already exists
    // Instead, we treat each prescription as a unique item
    setCartItems(prevItems => [...prevItems, { ...prescriptionItem, quantity: 1 }]);
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getItemQuantity = (itemId: string): number => {
    const item = cartItems.find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
  };

  const getCartTotal = (): number => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = (): number => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getPrescriptionItems = (): CartItem[] => {
    return cartItems.filter(item => item.prescriptionId);
  };

  const getServiceItems = (): CartItem[] => {
    return cartItems.filter(item => !item.prescriptionId);
  };

  return {
    cartItems,
    isLoading,
    addToCart,
    addPrescriptionToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    getCartTotal,
    getCartItemCount,
    getPrescriptionItems,
    getServiceItems
  };
}