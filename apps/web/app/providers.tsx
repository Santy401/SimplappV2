'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SettingsProvider } from './context/SettingsContext';
import { SessionProvider } from './context/SessionContext';
import { LoadingProvider } from './context/LoadingContext';
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';

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
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                closeButton={false}
                transition={Slide}
                toastClassName={(context) => {
                    const defaultClass = context?.defaultClassName || '';
                    const baseClasses = `${defaultClass} relative !p-4 min-h-16 rounded-xl cursor-pointer mb-3 bg-white text-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 font-sans`;

                    if (context?.type === 'success') return `${baseClasses} !border-l-4 !border-l-green-500`;
                    if (context?.type === 'error') return `${baseClasses} !border-l-4 !border-l-red-500`;
                    if (context?.type === 'warning') return `${baseClasses} !border-l-4 !border-l-yellow-500`;
                    if (context?.type === 'info') return `${baseClasses} !border-l-4 !border-l-blue-500`;

                    return baseClasses;
                }}

                progressClassName={(context) => {
                    const defaultClass = context?.defaultClassName || '';
                    const baseProgress = `${defaultClass} !h-[3px]`;
                    if (context?.type === 'success') return `${baseProgress} !bg-green-500`;
                    if (context?.type === 'error') return `${baseProgress} !bg-red-500`;
                    if (context?.type === 'warning') return `${baseProgress} !bg-yellow-500`;
                    if (context?.type === 'info') return `${baseProgress} !bg-blue-500`;
                    return `${baseProgress} !bg-gray-400`;
                }}
                icon={(props) => {
                    if (props.type === 'success') return <CheckCircle2 className="text-green-500 w-5 h-5 flex-shrink-0 mt-0.5" />;
                    if (props.type === 'error') return <XCircle className="text-red-500 w-5 h-5 flex-shrink-0 mt-0.5" />;
                    if (props.type === 'warning') return <AlertCircle className="text-yellow-500 w-5 h-5 flex-shrink-0 mt-0.5" />;
                    if (props.type === 'info') return <Info className="text-blue-500 w-5 h-5 flex-shrink-0 mt-0.5" />;
                    return null;
                }}
            />
        </QueryClientProvider>
    );
}
