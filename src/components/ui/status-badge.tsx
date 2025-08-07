import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "confirmed" | "pending" | "cancelled" | "completed"
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    confirmed: {
      label: "Confirmed",
      className: "status-confirmed"
    },
    pending: {
      label: "Pending",
      className: "status-pending"
    },
    cancelled: {
      label: "Cancelled",
      className: "status-cancelled"
    },
    completed: {
      label: "Completed",
      className: "status-confirmed"
    }
  }

  const config = statusConfig[status]

  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
      config.className,
      className
    )}>
      {config.label}
    </span>
  )
}