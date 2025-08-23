'use client'

interface ProductInfoProps {
  tags: string[]
  title: string
  description?: string
}

export function ProductInfo({ tags, title, description }: ProductInfoProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
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
        <p className="text-text-primary line-clamp-1 text-2xl font-bold">{title}</p>
        {description && <p className="text-text-secondary mt-0.5 text-sm">{description}</p>}
      </div>
    </div>
  )
}
