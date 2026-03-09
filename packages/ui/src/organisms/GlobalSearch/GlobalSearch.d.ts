interface SearchResult {
    id: string;
    label: string;
    description: string;
    icon: React.ReactNode;
    category: string;
    backendType?: string;
    backendId?: string;
    raw?: unknown;
}
interface GlobalSearchProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (id: string, item?: SearchResult) => void;
}
export declare function GlobalSearch({ isOpen, onClose, onSelect }: GlobalSearchProps): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=GlobalSearch.d.ts.map