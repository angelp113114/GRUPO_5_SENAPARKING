// StrictMode: Ayuda a detectar problemas en el código (solo en desarrollo)
import { StrictMode } from 'react'

// createRoot: Función para renderizar React en el DOM
import { createRoot } from 'react-dom/client'

// Estilos globales
import './index.css'

// El componente principal de la app
import App from './App.jsx'

// Busca el elemento con id="root" en index.html y renderiza la app
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)