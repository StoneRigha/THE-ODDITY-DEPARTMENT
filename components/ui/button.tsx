import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
const buttonVariants = cva('inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a47d55] disabled:pointer-events-none disabled:opacity-50', { variants: { variant: { default: 'bg-[#a47d55] text-[#211f1a] hover:bg-[#c09a70]', outline: 'border border-white/15 bg-transparent text-[#eae5d9] hover:border-[#a47d55]', ghost: 'text-[#eae5d9] hover:bg-white/5' }, size: { default: 'h-10 px-4 py-2', sm: 'h-9 px-3 text-xs', lg: 'h-12 px-6', icon: 'h-10 w-10' } }, defaultVariants: { variant: 'default', size: 'default' } });
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />);
Button.displayName = 'Button';
