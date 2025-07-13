import { useState } from 'react';
import { FaShoppingCart, FaTimes, FaSpinner, FaTrash } from 'react-icons/fa';
import './cart.css';

const Cart = ({ cart, onClose, onRemove, onClaim, onClearCart, isClaiming }) => {
  const [isClearing, setIsClearing] = useState(false);

  const handleClaim = async () => {
    try {
      await onClaim();
    } catch (error) {
      console.error('Error claiming items:', error);
    }
  };

  const handleClearCart = async () => {
    setIsClearing(true);
    try {
      await onClearCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert(error.message);
    } finally {
      setIsClearing(false);
    }
  };

  const extractFilename = (path) => {
    return path ? path.split('/').pop() : null;
  };

  const pendingItems = cart.filter(item => item.status === 'pending');
  const hasItems = cart.length > 0;

  return (
    <div className="cart-modal-overlay">
      <div className="cart-modal">
        <button className="close-cart" onClick={onClose}>
          <FaTimes />
        </button>
        
        <h3>Tu Carrito de Donaciones</h3>
        
        {!hasItems ? (
          <p className="empty-cart">No hay artículos en tu carrito</p>
        ) : (
          <>
            <div className="cart-items">
              {cart.map(item => (
                <div key={item._id} className="cart-item">
                  <img 
                    src={item.donation_details?.image_url 
                      ? `http://localhost:5001/proxy-image/${extractFilename(item.donation_details.image_url)}`
                      : '/no_image_available.jpg'}
                    alt={item.donation_details?.title}
                  />
                  <div className="cart-item-info">
                    <h4>{item.donation_details?.title || 'Sin título'}</h4>
                    <p>{item.donation_details?.description || 'Sin descripción'}</p>
                    <span className="cart-item-status">
                      Estado: {item.status === 'pending' ? 'Pendiente' : 'Reclamado'}
                    </span>
                  </div>
                  <button 
                    onClick={() => onRemove(item._id)}
                    className="remove-item"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
            
            <div className="cart-actions">
              {hasItems && (
                <button 
                  onClick={handleClearCart}
                  className="clear-cart-button"
                  disabled={isClearing || isClaiming}
                >
                  {isClearing ? (
                    <>
                      <FaSpinner className="spinner" /> Vaciando...
                    </>
                  ) : (
                    <>
                      <FaTrash /> Vaciar Carrito
                    </>
                  )}
                </button>
              )}
              
              {pendingItems.length > 0 && (
                <button 
                  onClick={handleClaim}
                  className="claim-button"
                  disabled={isClaiming || isClearing}
                >
                  {isClaiming ? (
                    <>
                      <FaSpinner className="spinner" /> Reclamando...
                    </>
                  ) : (
                    `Reclamar Donaciones (${pendingItems.length})`
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;