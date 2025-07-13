import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DonationPage from './components/DonationPage'
import ProductList from './components/ProductList'
//import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom'
import RegistroPage from './components/registroPage/RegistroPage'
import LoginPage from './components/loginPage/LoginPage'
import RecuperarPasswordPage from './components/recuperarPasswordPage/RecuperarPasswordPage'




function App() {
  return (
    <Routes>
      <Route path="/" element={<DonationPage />} />
      <Route path="/donaciones" element={<ProductList />} />
      <Route path="/registro" element={<RegistroPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/recuperar-contrasena" element={<RecuperarPasswordPage />} />
    </Routes>
  )
}

export default App
