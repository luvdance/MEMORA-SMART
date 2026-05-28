import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import posthog from 'posthog-js'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import './dashboard.css'

posthog.init('phc_DnECovXg7mktZUwdPRA4oM2ewZdNmBX4hzMpZk37f2by', {
  api_host: 'https://us.i.posthog.com',
  defaults: '2026-01-30',
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)