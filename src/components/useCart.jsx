import { useState } from 'react';

const useCart = () => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const addToCart = async (product) => {
    try {
      const response = await fetch('http://localhost:5003/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: 'juan@gmail.com', // Get from auth
          donation_id: product.id,
          notes: ''
        })
      });

      if (response.ok) {
        const newItem = await response.json();
        setCart([...cart, newItem]);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const response = await fetch(`http://localhost:5003/cart/${cartItemId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setCart(cart.filter(item => item.id !== cartItemId));
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const claimCartItems = async () => {
    try {
      await Promise.all(
        cart.map(item => 
          fetch(`http://localhost:5003/cart/${item.id}/claim`, { method: 'POST' })
        )
      );
      setCart([]);
      setShowCart(false);
      alert('¡Donaciones reclamadas con éxito!');
    } catch (error) {
      console.error('Error claiming items:', error);
    }
  };

  return {
    cart,
    showCart,
    setShowCart,
    addToCart,
    removeFromCart,
    claimCartItems
  };
};

export default useCart;