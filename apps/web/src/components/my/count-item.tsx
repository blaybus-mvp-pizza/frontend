export default function CountItem({
  className,
  label,
  count,
}: {
  className?: string
  label: string
  count: number
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-1.5 bg-white px-6 py-4 ${className}`}
    >
      <div className="whitespace-nowrap text-xs font-medium text-gray-500 sm:text-sm">{label}</div>
      <div className="mb-0.5 flex items-center gap-1 font-semibold text-black">
        <span className="text-xl">{count}</span>
        <span className="text-lg">건</span>
      </div>
    </div>
  )
}
