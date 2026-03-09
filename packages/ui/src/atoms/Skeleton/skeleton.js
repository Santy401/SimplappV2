import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../../utils/utils";
function Skeleton({ className, ...props }) {
    return (_jsx("div", { className: cn("animate-pulse rounded-md bg-muted/60 dark:bg-muted/40", className), ...props }));
}
export { Skeleton };
