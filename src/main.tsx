import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from '@tanstack/react-router';
import { router } from './routes'
import { AuthProvider, useAuth } from './context';

function RouterAuthWrapper() {
  const auth = useAuth();
  return (
    <RouterProvider router={router} context={{ auth }} />
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterAuthWrapper />
    </AuthProvider>
  </StrictMode>,
)
