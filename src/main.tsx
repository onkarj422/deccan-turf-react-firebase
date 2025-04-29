import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from '@tanstack/react-router';
import { router } from './routes'
import { AuthProvider, useAuth } from './context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { theme } from './theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  }
});

function RouterAuthWrapper() {
  const auth = useAuth();
  return (
    <RouterProvider router={router} context={{ auth }} />
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme='dark'>
        <AuthProvider>
          <RouterAuthWrapper />
        </AuthProvider>
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>,
)
