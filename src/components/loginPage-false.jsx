import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Para saber si el usuario ya inició sesión
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e) => {
  e.preventDefault();
  
  if (validateForm()) {
    setIsSubmitting(true);
    
    try {
      const res = await fetch('http://localhost:5002/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          password: formData.password,
          role: 'admin' // Ajusta según necesites
        })
      });

      const data = await res.json();

      if (res.ok) {
        // Guardar el token y datos del usuario como en tu versión anterior
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user_email', data.email);
        localStorage.setItem('user_name', data.name);
        localStorage.setItem('user_admin', data.admin);
        
        // Redirigir al dashboard
        navigate("/dashboard");
      } else {
        setErrors({ submit: data.message || 'Error al iniciar sesión' });
      }
    } catch (error) {
      console.error("Error en el login:", error);
      setErrors({ submit: "Error de red o del servidor" });
    } finally {
      setIsSubmitting(false);
    }
  }
};

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_admin');
    setIsLoggedIn(false);
    setError('');
    navigate('/');
  };

  return (
    <div style={{ padding: '2rem' }}>
      {isLoggedIn ? (
        <>
          <h2>Ya estás autenticado</h2>
          <p>¿Deseas cerrar sesión?</p>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </>
      ) : (
        <>
          <h2>Iniciar sesión</h2>
          <form onSubmit={handleLogin}>
            <div>
              <label>Email:</label><br />
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label>Contraseña:</label><br />
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit">Entrar</button>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </>
      )}
    </div>
  );
}

export default LoginPage;
