import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DonationPage from './components/DonationPage'
import ProductList from './components/ProductList'
//import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom'




function App() {
  return (
    <Routes>
      <Route path="/" element={<DonationPage />} />
      <Route path="/donaciones" element={<ProductList />} />
    </Routes>
  )
}

export default App
