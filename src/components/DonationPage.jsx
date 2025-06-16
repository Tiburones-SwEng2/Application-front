import React, { useState } from "react";
import PropTypes from "prop-types";
import FormularioDonacion from "./FormularioDonacion";
import { FaHandsHelping, FaDonate, FaBoxOpen, FaMedkit, FaTshirt, FaHeart } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useNavigate } from 'react-router-dom'
import "./DonationPage.css";

function DonacionPage() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  return (
    <div className="donation-app">
      <header className="donation-header">
        <div className="header-overlay">
          <div className="header-content">
            <h1>Programa de <span>Solidaridad Comunitaria</span></h1>
            <p>Transformando vidas a través de la generosidad colectiva</p>
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
        {!mostrarFormulario ? (
          <DonationHero onDonarClick={() => setMostrarFormulario(true)} />
        ) : (
          <DonationModal onClose={() => setMostrarFormulario(false)} />
        )}
      </main>

      <footer className="donation-footer">
        <div className="footer-content">
          <div className="footer-heart">
            <FaHeart />
          </div>
          <p>© {new Date().getFullYear()} Iniciativa Solidaria. Todos los derechos reservados.</p>
          <div className="footer-links">
            <a href="/privacidad">Política de Privacidad</a>
            <a href="/contacto">Contacto</a>
            <a href="/transparencia">Transparencia</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const DonationHero = ({ onDonarClick }) => {
  const navigate = useNavigate();
  return(
  <div className="hero-container">
    <div className="hero-content">
      <div className="hero-text">
        <div className="hero-badge">
          <FaHandsHelping className="hero-icon" />
        </div>
        <h2>Tu contribución <span>hace la diferencia</span></h2>
        <p className="lead-text">
          Únete a nuestra red de donantes y ayuda a construir una comunidad más fuerte y solidaria.
          Cada aporte, sin importar su tamaño, contribuye directamente al bienestar de quienes más lo necesitan.
        </p>
        <div className="donation-types">
          <div className="donation-item">
            <div className="donation-icon-container">
              <FaBoxOpen className="donation-icon" />
            </div>
            <div className="donation-info">
              <h4>Alimentos no perecederos</h4>
              <p>Arroz, frijoles, aceite, harina y más</p>
            </div>
          </div>
          <div className="donation-item">
            <div className="donation-icon-container">
              <FaTshirt className="donation-icon" />
            </div>
            <div className="donation-info">
              <h4>Vestimenta en buen estado</h4>
              <p>Ropa para todas las edades y tallas</p>
            </div>
          </div>
          <div className="donation-item">
            <div className="donation-icon-container">
              <FaMedkit className="donation-icon" />
            </div>
            <div className="donation-info">
              <h4>Medicamentos y suministros</h4>
              <p>Primeros auxilios y medicinas básicas</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="hero-action">
        <div className="action-card">
          <button onClick={onDonarClick} className="donate-button">
            <FaDonate className="button-icon" />
            Realizar donación
          </button>

          <button 
            onClick={() => navigate('/donaciones')} // Navegación programática
            className="donate-button secondary"
          >
            <FaBoxOpen className="button-icon" />
            Ver donaciones disponibles
          </button>
          
          <div className="impact-stats">
            <div className="stat-item">
              <span className="stat-number">1,240+</span>
              <span className="stat-label">Donaciones recibidas</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">560+</span>
              <span className="stat-label">Familias beneficiadas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)
}

const DonationModal = ({ onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
      <button className="modal-close" onClick={onClose}>
        <MdClose />
      </button>
      <div className="modal-header">
        <div className="modal-badge">
          <FaDonate />
        </div>
        <h3>Formulario de Donación</h3>
        <p>Complete los siguientes datos para procesar su contribución</p>
      </div>
      <FormularioDonacion onVolver={onClose} />
    </div>
  </div>
);

DonationHero.propTypes = {
  onDonarClick: PropTypes.func.isRequired
};

DonationModal.propTypes = {
  onClose: PropTypes.func.isRequired
};

export default DonacionPage;