import { useEffect, useState } from 'react';
import { FaHeart, FaHome, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Cart from './Cart';
import useCart from './useCart';
import './ProductList.css';
import './DonationPage.css';

// Listas estáticas
const categories = ['Todos', 'Comida', 'Ropa', 'Medicamentos', 'Útiles escolares', 'Otros'];
const cities = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga', 'Otra'];
const conditions = ['Nuevo', 'Usado'];

function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedCity, setSelectedCity] = useState('Todas');
  const [selectedCondition, setSelectedCondition] = useState('Todas');

  // Cart functionality using custom hook
  const { 
    cart, 
    showCart, 
    setShowCart, 
    addToCart, 
    removeFromCart, 
    claimCartItems 
  } = useCart();

  const fetchProducts = () => {
    setLoading(true);
    fetch('http://localhost:5001/filteredDonations')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al cargar productos:', error);
        setLoading(false);
      });
  };

  function extractFilename(path) {
    return path ? path.split('/').pop() : null;
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    const matchesCity = selectedCity === 'Todas' || p.city === selectedCity;
    const matchesCondition = selectedCondition === 'Todas' || p.condition === selectedCondition;
    return matchesCategory && matchesCity && matchesCondition;
  });

  if (loading) {
    return (
      <div className="pl-product-app">
        <div className="loading-container">
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pl-product-app">
      <header className="donation-header">
        <div className="header-overlay">
          <div className="header-content">
            <h1>Donaciones <span> Disponibles </span></h1>
            <p>Encuentra lo que necesitas o ayuda a quienes más lo necesitan.</p>
            <div className="header-wave">
              <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
                <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
                <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
              </svg>
            </div>
          </div>
        </div>
      </header>

      <main className="donation-main">
        <div className="hero-container">
          <div className="pl-product-layout">
            <div className="pl-category-panel">
              <div className="home-button-container">
                <button onClick={() => navigate('/')} className="home-button" aria-label="Volver al inicio">
                  <FaHome className="home-icon" />
                  <span className="home-text">Inicio</span>
                </button>
              </div>

              <div className="home-button-container">
                <button 
                  onClick={() => setShowCart(!showCart)} 
                  className="home-button"
                  aria-label="Ver carrito"
                >
                  <FaShoppingCart className="cart-icon" />
                  <span className="cart-text">Carrito</span>
                  {cart.length > 0 && (
                    <span className="cart-badge">{cart.length}</span>
                  )}
                </button>
              </div>

              <div className="pl-filter-group">
                <h3>Categorías</h3>
                <div className="pl-filter-options">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      className={selectedCategory === cat ? 'active' : ''}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pl-filter-group">
                <h3>Ciudad</h3>
                <div className="pl-filter-options">
                  <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                    <option value="Todas">Todas las ciudades</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pl-filter-group">
                <h3>Condición</h3>
                <div className="pl-filter-options">
                  <select value={selectedCondition} onChange={(e) => setSelectedCondition(e.target.value)}>
                    <option value="Todas">Todas las condiciones</option>
                    {conditions.map(cond => (
                      <option key={cond} value={cond}>{cond}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pl-product-panel">
              <div className="pl-product-grid">
                {filteredProducts.map((product) => (
                  <div className="pl-product-card" key={product.id}>
                    <img
                      src={
                        extractFilename(product.image_url) 
                          ? `http://localhost:5001/proxy-image/${extractFilename(product.image_url)}`
                          : '/no_image_available.jpg'
                      }
                      alt={product.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/no_image_available.jpg';
                      }}
                    />

                    <h3>{product.title}</h3>
                    <p>{product.description}</p>
                    <button 
                      onClick={() => addToCart(product)}
                      className="add-to-cart-btn"
                    >
                      <FaShoppingCart /> Añadir
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="donation-footer">
        <div className="footer-content">
          <div className="footer-heart"><FaHeart /></div>
          <p>© {new Date().getFullYear()} Iniciativa Solidaria. Todos los derechos reservados.</p>
          <div className="footer-links">
            <a href="/privacidad">Política de Privacidad</a>
            <a href="/contacto">Contacto</a>
            <a href="/transparencia">Transparencia</a>
          </div>
        </div>
      </footer>

      {showCart && (
        <Cart
          cart={cart}
          onClose={() => setShowCart(false)}
          onRemove={removeFromCart}
          onClaim={claimCartItems}
        />
      )}
    </div>
  );
}

export default ProductList;

