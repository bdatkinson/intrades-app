import * as React from 'react'
import { cn } from '@/lib/utils'

export function Separator({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) {
  return <hr className={cn('my-2 border-t border-[var(--brand-border)]', className)} {...props} />
}
