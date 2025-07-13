import React, { useState } from "react";
import { FaUserPlus, FaArrowLeft, FaLock, FaEnvelope, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./RegistroPage.css"; 
import { ParticlesBackground } from "../loginPage/ParticlesBackground";

function RegistroPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email no válido";
    }
    
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Aquí iría la llamada a tu API de registro
        console.log("Registrando usuario:", formData);
        
        // Simulamos un retraso de red
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Redirigir al usuario después del registro exitoso
        navigate("/login", { state: { registrationSuccess: true } });
      } catch (error) {
        console.error("Error en el registro:", error);
        setErrors({ submit: "Error al registrar. Inténtalo nuevamente." });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="registro-container">
        <ParticlesBackground />
      <div className="registro-card">
        <Link to="/" className="back-button">
          <FaArrowLeft /> Volver al inicio
        </Link>
        
        <div className="registro-header">
          <div className="registro-icon">
            <FaUserPlus />
          </div>
          <h2>Crear una cuenta</h2>
          <p>Únete a nuestra comunidad solidaria</p>
        </div>
        
        <form onSubmit={handleSubmit} className="registro-form">
          {errors.submit && <div className="error-message">{errors.submit}</div>}
          
          <div className={`form-group ${errors.nombre ? "has-error" : ""}`}>
            <label htmlFor="nombre">
              <FaUser className="input-icon" /> Nombre completo
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ingresa tu nombre completo"
            />
            {errors.nombre && <span className="error-text">{errors.nombre}</span>}
          </div>
          
          <div className={`form-group ${errors.email ? "has-error" : ""}`}>
            <label htmlFor="email">
              <FaEnvelope className="input-icon" /> Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ingresa tu email"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          
          <div className={`form-group ${errors.password ? "has-error" : ""}`}>
            <label htmlFor="password">
              <FaLock className="input-icon" /> Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Crea una contraseña"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          
          <div className={`form-group ${errors.confirmPassword ? "has-error" : ""}`}>
            <label htmlFor="confirmPassword">
              <FaLock className="input-icon" /> Confirmar contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
            />
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
            )}
          </div>
          
          <button 
            type="submit" 
            className="registro-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registrando..." : "Registrarse"}
          </button>
        </form>
        
        <div className="login-link">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}

export default RegistroPage;