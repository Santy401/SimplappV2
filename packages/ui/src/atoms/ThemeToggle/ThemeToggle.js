"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from '@ui/atoms/Button/Button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@ui/atoms/DropdownMenu/dropdown-menu";
import { useEffect, useState } from "react";
export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const isDark = theme === "dark";
    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted)
        return null;
    return (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs(Button, { variant: "outline", size: "icon", className: "border border-sidebar-border flex w-7 h-7 flex items-center justify-center rounded cursor-pointer bottom-1 right-2", children: [isDark ? (_jsx(Moon, { className: "h-[1.2rem] w-[1.2rem] transition-all" })) : (_jsx(Sun, { className: "h-[1.2rem] text-black w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" })), _jsx("span", { className: "sr-only", children: "Toggle theme" })] }) }), _jsxs(DropdownMenuContent, { align: "end", children: [_jsx(DropdownMenuItem, { onClick: () => setTheme("light"), children: "Light" }), _jsx(DropdownMenuItem, { onClick: () => setTheme("dark"), children: "Dark" }), _jsx(DropdownMenuItem, { onClick: () => setTheme("system"), children: "System" })] })] }));
}
