import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { startAnalytics } from './utils/analytics'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import './dashboard.css'

startAnalytics()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)