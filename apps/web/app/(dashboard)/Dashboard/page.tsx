'use client';

import { useEffect, useState } from "react";
import { useSession } from "@hooks/features/auth/use-session";
import { Loader2 } from "lucide-react";
import { Dashboard, WidgetConfig } from "@simplapp/ui";

export default function DashboardPage() {
    const { user } = useSession();
    const userName = user?.name || "Administrador";

    const [metrics, setMetrics] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [savedLayout, setSavedLayout] = useState<any>(null);

    // Cargar métricas de la API
    useEffect(() => {
        let mounted = true;
        fetch('/api/metrics/dashboard')
            .then(res => res.json())
            .then(data => {
                if (mounted && !data.error) {
                    setMetrics(data);
                }
            })
            .catch(err => console.error(err))
            .finally(() => {
                if (mounted) setIsLoading(false);
            });
        return () => { mounted = false; };
    }, []);

    // Cargar layout personalizado de localStorage
    useEffect(() => {
        const local = localStorage.getItem('simplapp-dashboard-layout');
        if (local) {
            try {
                setSavedLayout(JSON.parse(local));
            } catch (e) {
                console.error("Error parsing saved layout", e);
            }
        }
    }, []);

    const handleSaveLayout = (layout: any, _widgets: any) => {
        localStorage.setItem('simplapp-dashboard-layout', JSON.stringify(layout));
        setSavedLayout(layout);
    };

    if (isLoading || !metrics) {
        return (
            <div className="flex w-full h-[60vh] items-center justify-center">
                <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
            </div>
        );
    }

    return (
        <Dashboard 
            userName={userName}
            metrics={metrics}
            initialLayout={savedLayout}
            onSaveLayout={handleSaveLayout}
            onViewAllBills={() => {
                // Aquí podrías usar NavigationContext para redirigir si fuera necesario
                console.log("Ver todas las facturas pulsado");
            }}
        />
    );
}
