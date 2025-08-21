"use client";

interface ProductInfoProps {
  tags: string[];
  title: string;
  description?: string;
}

export function ProductInfo({ tags, title, description }: ProductInfoProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {tags.map((tag) => (
          <span
            key={tag}
            className="border-[#E5E5EC] text-xs border text-grey-800 px-[10px] py-[2px]"
          >
            {tag}
          </span>
        ))}
      </div>

      <div>
        <p className="text-2xl text-[#111111] font-bold">{title}</p>
        {description && (
          <p className="text-[#505050] text-sm mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}