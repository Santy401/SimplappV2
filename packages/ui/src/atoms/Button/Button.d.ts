import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { type HTMLMotionProps } from "framer-motion";
type ButtonBaseProps = VariantProps<typeof buttonVariants> & {
    className?: string;
};
type ButtonMotionProps = ButtonBaseProps & HTMLMotionProps<"button"> & {
    asChild?: false;
};
type ButtonSlotProps = ButtonBaseProps & {
    asChild: true;
    children: React.ReactNode;
};
type ButtonProps = ButtonMotionProps | ButtonSlotProps;
declare const buttonVariants: (props?: ({
    variant?: "default" | "defaultLoading" | "WithIcon" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
    size?: "default" | "sm" | "lg" | "icon" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function Button(props: ButtonProps): import("react/jsx-runtime").JSX.Element;
export { Button, buttonVariants };
//# sourceMappingURL=Button.d.ts.map