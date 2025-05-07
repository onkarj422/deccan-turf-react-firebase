import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { router } from './routes';
import { AuthProvider, useAuth } from './context';
import { theme } from './theme';
import './index.css';
import '@mantine/notifications/styles.css';

declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
      title?: string
      disableNavBar?: boolean
  }
}

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
    },
});

function RouterAuthWrapper() {
    const auth = useAuth();
    return (
        <RouterProvider
            router={router}
            context={{ auth }}
            defaultViewTransition
        />
    );
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <MantineProvider
                theme={theme}
                defaultColorScheme="light"
            >
                <Notifications />
                <AuthProvider>
                    <RouterAuthWrapper />
                </AuthProvider>
            </MantineProvider>
        </QueryClientProvider>
    </StrictMode>,
);
