import { Search } from 'lucide-react'

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search machines…',
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <div className="card flex items-center gap-2 px-3 py-2">
      <Search className="size-4 text-slate-500" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        aria-label="Search products"
      />
    </div>
  )
}

