import { FaShoppingCart, FaTimes } from 'react-icons/fa';
import './ProductList.css';
import './cart.css';

const Cart = ({ cart, onClose, onRemove, onClaim }) => {
  const extractFilename = (path) => {
    return path ? path.split('/').pop() : null;
  };

  return (
    <div className="cart-modal-overlay">
      <div className="cart-modal">
        <button className="close-cart" onClick={onClose}>
          <FaTimes />
        </button>
        
        <h3>Tu Carrito de Donaciones</h3>
        
        {cart.length === 0 ? (
          <p className="empty-cart">No hay artículos en tu carrito</p>
        ) : (
          <>
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <img 
                    src={item.donation_details?.image_url 
                      ? `http://localhost:5001/proxy-image/${extractFilename(item.donation_details.image_url)}`
                      : '/no_image_available.jpg'}
                    alt={item.donation_details?.title}
                  />
                  <div className="cart-item-info">
                    <h4>{item.donation_details?.title}</h4>
                    <p>{item.donation_details?.description}</p>
                    <span className="cart-item-city">
                      {item.donation_details?.city || 'Sin ubicación'}
                    </span>
                  </div>
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="remove-item"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
            
            <div className="cart-actions">
              <button 
                onClick={onClaim}
                className="claim-button"
              >
                Reclamar Donaciones ({cart.length})
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;