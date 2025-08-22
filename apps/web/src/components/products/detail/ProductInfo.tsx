'use client'

interface ProductInfoProps {
  tags: string[]
  title: string
  description?: string
}

export function ProductInfo({ tags, title, description }: ProductInfoProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-grey-800 border border-[#E5E5EC] px-[10px] py-[2px] text-xs"
          >
            {tag}
          </span>
        ))}
      </div>

      <div>
        <p className="text-2xl font-bold text-[#111111]">{title}</p>
        {description && <p className="mt-0.5 text-sm text-[#505050]">{description}</p>}
      </div>
    </div>
  )
}
