import { useEffect } from 'react';
import { useLoading } from '@/app/context/LoadingContext';

/**
 * Hook para manejar el estado de carga de un componente
 * Automáticamente reporta al LoadingContext cuando el componente está cargando
 * 
 * @param isLoading - Estado de carga del componente
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const [isLoading, setIsLoading] = useState(true);
 *   
 *   // Reportar automáticamente el estado de carga
 *   useComponentLoading(isLoading);
 *   
 *   useEffect(() => {
 *     fetchData().finally(() => setIsLoading(false));
 *   }, []);
 *   
 *   return <div>Content</div>;
 * }
 * ```
 */
export function useComponentLoading(isLoading: boolean) {
    const { setComponentLoading } = useLoading();

    useEffect(() => {
        setComponentLoading(isLoading);

        // Limpiar cuando el componente se desmonta
        return () => {
            setComponentLoading(false);
        };
    }, [isLoading, setComponentLoading]);
}
