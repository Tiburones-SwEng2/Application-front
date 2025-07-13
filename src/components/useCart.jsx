import { useState } from 'react';

const useCart = () => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token'); // Asume que el token se guarda al hacer login
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchCart = async () => {
    try {
      const response = await fetch('http://localhost:5003/cart', {
        method: 'GET',
        headers: getAuthHeader()
      });

      if (response.ok) {
        const cartData = await response.json();
        setCart(cartData);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (product) => {
    try {
      const response = await fetch('http://localhost:5003/cart', {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({
          donation_id: product.id,
          notes: ''
        })
      });

      if (response.ok) {
        await fetchCart(); // Actualizar el carrito después de añadir
      } else {
        const errorData = await response.json();
        console.error('Error adding to cart:', errorData);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const response = await fetch(`http://localhost:5003/cart/${cartItemId}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });

      if (response.ok) {
        await fetchCart(); // Actualizar el carrito después de eliminar
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  // Refrescar el carrito después de reclamar
const refreshCart = async () => {
  const res = await fetch('/api/cart');
  const data = await res.json();
  setCartItems(data.items.filter(item => item.status === 'pending')); // Filtrar solo pendientes
};

const handleClaim = async (itemId) => {
  try {
    await claimItem(itemId); // Tu función existente
    await refreshCart(); // Actualizar el estado del frontend
    showToast("Item claimed successfully!");
  } catch (error) {
    showToast(error.message, "error");
  }
};
  const claimCartItems = async () => {
    try {
      // Reclamar cada item individualmente
      for (const item of cart) {
        const response = await fetch(
          `http://localhost:5003/cart/${item._id}/claim`, 
          {
            method: 'POST',
            headers: getAuthHeader()
          }
        );
        
        if (!response.ok) {
          throw new Error(`Error claiming item ${item._id}`);
        }
      }
      
      setCart([]);
      setShowCart(false);
      alert('¡Donaciones reclamadas con éxito!');
    } catch (error) {
      console.error('Error claiming items:', error);
      alert('Error al reclamar donaciones: ' + error.message);
    }
  };

  return {
    cart,
    showCart,
    setShowCart,
    fetchCart, // Exportar fetchCart para poder usarlo cuando el usuario haga login
    addToCart,
    removeFromCart,
    claimCartItems
  };
};

export default useCart;