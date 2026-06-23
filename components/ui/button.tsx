import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_2px_10px_rgba(24,95,165,0.32)] hover:-translate-y-0.5 hover:bg-[#1568a0] hover:shadow-[0_6px_20px_rgba(24,95,165,0.38)] active:translate-y-0 active:shadow-[0_2px_8px_rgba(24,95,165,0.28)]",
        accent:
          "bg-accent text-white shadow-[0_2px_10px_rgba(29,158,117,0.32)] hover:-translate-y-0.5 hover:bg-[#188f66] hover:shadow-[0_6px_20px_rgba(29,158,117,0.38)] active:translate-y-0",
        outline:
          "border-2 border-border bg-white text-foreground shadow-sm hover:-translate-y-0.5 hover:border-primary/25 hover:bg-primary/[0.04] hover:shadow-md active:translate-y-0",
        secondary:
          "border border-border bg-secondary text-secondary-foreground shadow-sm hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:translate-y-0",
        ghost:
          "text-muted-foreground hover:bg-primary/[0.08] hover:text-primary active:bg-primary/10",
        soft:
          "bg-primary/10 text-primary shadow-none hover:bg-primary/15 hover:shadow-sm active:bg-primary/20",
        destructive:
          "bg-danger/10 text-danger shadow-sm hover:-translate-y-0.5 hover:bg-danger/15 hover:shadow-md active:translate-y-0",
        link: "text-primary underline-offset-4 shadow-none hover:underline",
      },
      size: {
        default: "h-10 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-7 gap-1 rounded-lg px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-9 gap-1.5 rounded-xl px-3 text-[0.8125rem] has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-2 rounded-xl px-5 text-base has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon: "size-10 rounded-xl",
        "icon-xs": "size-7 rounded-lg [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-9 rounded-xl [&_svg:not([class*='size-'])]:size-4",
        "icon-lg": "size-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
