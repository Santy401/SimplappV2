'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SettingsProvider } from './context/SettingsContext';
import { SessionProvider } from './context/SessionContext';
import { LoadingProvider } from './context/LoadingContext';

export function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // 5 minutos — alineado con useSession (evita refetches innecesarios)
                        // Si necesitas datos más frescos en alguna query específica, override
                        // con staleTime en esa query individual.
                        staleTime: 5 * 60 * 1000,
                        gcTime: 10 * 60 * 1000,   // 10 min en memoria después de sin suscriptores
                        refetchOnWindowFocus: false,
                        retry: 1,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                <LoadingProvider>
                    <SettingsProvider>
                        {children}
                    </SettingsProvider>
                </LoadingProvider>
            </SessionProvider>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </QueryClientProvider>
    );
}
