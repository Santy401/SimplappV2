"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, type MotionValue, type HTMLMotionProps } from "framer-motion"

import { cn } from "../../utils/utils"

const MotionButton = motion.button

type ButtonBaseProps = VariantProps<typeof buttonVariants> & {
  className?: string
}

type ButtonMotionProps =
  ButtonBaseProps &
  HTMLMotionProps<"button"> & {
    asChild?: false
  }

type ButtonSlotProps =
  ButtonBaseProps & {
    asChild: true
    children: React.ReactNode
  }

type ButtonProps = ButtonMotionProps | ButtonSlotProps

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary cursor-pointer text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "border bg-background hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3",
        lg: "h-10 px-6",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button(props: ButtonProps) {
  const { className, variant, size } = props

  if (props.asChild) {
    return (
      <Slot
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
      >
        {props.children}
      </Slot>
    )
  }

  const { asChild, ...buttonProps } = props

  return (
    <MotionButton
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      whileTap={{ scale: 0.91 }}
      whileHover={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      {...buttonProps}
    />
  )
}


export { Button, buttonVariants }
