'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiClient } from '@interfaces/lib/api-client';
import { useSession } from '@hooks/features/auth/use-session';
import { Onboarding } from '@simplapp/ui';

export default function OnboardingPage() {
    const router = useRouter();
    const { refresh, user } = useSession();

    const handleSubmit = async (data: any) => {
        try {
            await apiClient.post('/api/auth/onboarding/', {
                userType: data.userType,
                companyName: data.companyName,
                country: data.country,
                currency: data.currency,
                companyLogo: data.companyLogo,
                invoicePrefix: data.invoicePrefix,
                defaultTax: data.defaultTax
            });

            await refresh(); // Refrescar la sesión para aplicar onboardingCompleted
            router.push('/')
        } catch (error) {
            console.error('Error al guardar onboarding:', error);
            toast.error('Ocurrió un error al guardar tu información.');
            throw error; // Re-lanzar para que el componente UI maneje el estado de carga
        }
    };

    const handleFinish = () => {};

    return (
        <Onboarding 
            onSubmit={handleSubmit}
            onFinish={handleFinish}
            initialData={{
                country: user?.country || 'Colombia'
            }}
        />
    );
}
