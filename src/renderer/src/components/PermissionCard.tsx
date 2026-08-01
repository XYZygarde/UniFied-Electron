/* eslint-disable prettier/prettier */

interface PermissionCardProps {
  title: string
  description: string
  index: number
  checked: boolean
  onToggle: (index: number) => void
}

function PermissionCard({ title, description, index, checked, onToggle }: PermissionCardProps): React.JSX.Element {
  return (
    <label className="flex cursor-pointer items-start gap-4 rounded-lg border border-white/30 bg-[#111625] px-4 py-5 transition-colors hover:border-blue-300/60 sm:gap-8 sm:px-6 sm:py-6">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onToggle(index)}
        className="peer sr-only"
      />

      <span
        aria-hidden="true"
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
          checked ? 'border-blue-400 bg-blue-400' : 'border-white bg-navy-950'
        }`}
      >
        {checked && (
          <span className="h-2.5 w-1.5 -translate-y-0.5 rotate-45 border-b-2 border-r-2 border-navy-950" />
        )}
      </span>

      <span className="min-w-0">
        <span className="block font-display text-base font-bold leading-6 text-white text-left sm:text-lg">{title}</span>
        <span className="mt-2 block text-[14px] text-left leading-5 text-white sm:mt-4">{description}</span>
      </span>
    </label>
  )
}

export default PermissionCard
