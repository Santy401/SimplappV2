export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  title?: string;
  searchable?: boolean;
  pagination?: boolean;
  itemsPerPage?: number;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onDeleteMany?: (items: T[]) => Promise<void>;
  onView?: (item: T) => void;
  onAdd?: () => void;
  onExport?: () => void;
  actions?: React.ReactNode;
  className?: string;
  isBillView?: boolean;

  isLoading?: {
    fetch: boolean;
    create: boolean;
    update: boolean;
    deleteId: string | null;
    deleteMany: boolean;
    export: boolean;
    view: boolean;
    rowId: string | null;
  }
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
  joinedDate: string;
  twoFA: "Enabled" | "Disabled";
}