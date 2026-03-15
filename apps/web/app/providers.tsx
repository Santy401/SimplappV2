'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SettingsProvider } from './context/SettingsContext';
import { SessionProvider, LoadingProvider } from '@simplapp/interfaces';
import { SessionExpiredModal } from '@simplapp/ui';
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';

export function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 60 * 1000,
                        gcTime: 10 * 60 * 1000,
                        refetchOnWindowFocus: false,
                        retry: 1,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider sessionExpiredModal={SessionExpiredModal}>
                <LoadingProvider>
                    <SettingsProvider>
                        {children}
                    </SettingsProvider>
                </LoadingProvider>
            </SessionProvider>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={true}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                closeButton={false}
                transition={Slide}
                toastClassName="simplapp-toast"
            />
        </QueryClientProvider>
    );
}
