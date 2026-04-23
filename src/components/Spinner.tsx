export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-10 text-slate-600">
      <div className="size-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
      {label ? <div className="text-sm font-semibold">{label}</div> : null}
    </div>
  )
}

