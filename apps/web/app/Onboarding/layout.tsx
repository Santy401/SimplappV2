import { ProtectedRoute } from "../(dashboard)/ProtectedRoute";

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ProtectedRoute>{children}</ProtectedRoute>;
}
