import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'

export const Sheet = DialogPrimitive.Root
export const SheetTrigger = DialogPrimitive.Trigger
export const SheetClose = DialogPrimitive.Close

export function SheetContent({ className, side = 'right', ...props }: React.ComponentProps<typeof DialogPrimitive.Content> & { side?: 'right' | 'left' }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/60" />
      <DialogPrimitive.Content
        className={cn(
          'fixed z-50 h-full w-72 border-[color:var(--brand-border)] bg-[color:var(--brand-bg)] p-4 shadow-xl outline-none',
          side === 'right' ? 'right-0 top-0 border-l' : 'left-0 top-0 border-r',
          className,
        )}
        {...props}
      />
    </DialogPrimitive.Portal>
  )
}

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4 flex items-center justify-between', className)} {...props} />
}

export function SheetTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={cn('text-sm font-medium text-foreground/70', className)} {...props} />
}
