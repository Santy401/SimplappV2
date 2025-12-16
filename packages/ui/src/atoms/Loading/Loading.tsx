export function FullScreenLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-muted" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    </div>
  )
}

export function ButtonLoading() {
  return (
    <span className="relative h-4 w-4">
      <span className="absolute inset-0 rounded-full border-2 border-muted" />
      <span className="absolute inset-0 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </span>
  )
}
