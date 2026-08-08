import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster
      position="bottom-center"
      toastOptions={{
        style: {
          background: '#181818',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.08)',
          fontSize: '13px',
        },
      }}
    />
  </StrictMode>,
)
