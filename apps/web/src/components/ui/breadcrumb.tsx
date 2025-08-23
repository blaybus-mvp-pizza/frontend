import Link from 'next/link'

import { cn } from '@workspace/ui/lib/utils'
import { ChevronRight } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center space-x-1 text-sm', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <div key={index} className="flex items-center">
            {index > 0 && <ChevronRight className="mx-1 h-4 w-4 text-gray-400" />}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="line-clamp-1 text-gray-600 transition-colors hover:text-gray-900"
              >
                {item.label}
              </Link>
            ) : (
              <span className={cn(isLast ? 'font-medium text-gray-900' : 'text-gray-600')}>
                {item.label}
              </span>
            )}
          </div>
        )
      })}
    </nav>
  )
}
