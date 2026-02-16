"use client"

import {
  Archive,
  CheckCircle,
  Copy,
  Edit,
  Eye,
  MoreHorizontal,
  Share2,
  Trash2,
  Loader2,
} from "lucide-react"
import { Button } from "../atoms/Button/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../atoms/DropdownMenu/dropdown-menu"

export type TableActionsDropdownProps = {
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onDuplicate?: () => void
  onExport?: () => void
  onArchive?: () => void
  onMarkAsPaid?: () => void
  isDeleting?: boolean
  className?: string
}

export function TableActionsDropdown({
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onExport,
  onArchive,
  onMarkAsPaid,
  isDeleting = false,
  className,
}: TableActionsDropdownProps) {
  // Si está eliminando, mostrar solo el loader
  if (isDeleting) {
    return (
      <div className="h-8 w-8 flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-red-400" />
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-8 w-8 flex items-center justify-center cursor-pointer" size="icon" variant="ghost" title="Acciones">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className={`w-44 ${className ?? ""}`}>
        {onView && (
          <DropdownMenuItem onClick={onView}>
            <Eye className="mr-2 size-4" />
            Ver
          </DropdownMenuItem>
        )}

        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="mr-2 size-4" />
            Editar
          </DropdownMenuItem>
        )}

        {onDuplicate && (
          <DropdownMenuItem onClick={onDuplicate}>
            <Copy className="mr-2 size-4" />
            Duplicar
          </DropdownMenuItem>
        )}

        {onExport && (
          <DropdownMenuItem onClick={onExport}>
            <Share2 className="mr-2 size-4" />
            Exportar
          </DropdownMenuItem>
        )}

        {onArchive && (
          <DropdownMenuItem onClick={onArchive}>
            <Archive className="mr-2 size-4" />
            Archivar
          </DropdownMenuItem>
        )}

        {onMarkAsPaid && (
          <DropdownMenuItem onClick={onMarkAsPaid}>
            <CheckCircle className="mr-2 size-4 text-green-600" />
            Marcar como pagada
          </DropdownMenuItem>
        )}

        {onDelete && <DropdownMenuSeparator />}

        {onDelete && (
          <DropdownMenuItem variant="destructive" onClick={onDelete}>
            <Trash2 className="mr-2 size-4" />
            Eliminar
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default TableActionsDropdown
