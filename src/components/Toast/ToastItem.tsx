"use client";

import { TickCircle, CloseCircle, InfoCircle, Warning2, CloseSquare } from "iconsax-react";
import { toast as hotToast, Toast } from "react-hot-toast";
import { useEffect, useState } from "react";

interface ToastItemProps {
    t: Toast;
    title?: string;
    message: string;
    type?: "success" | "error" | "loading" | "custom";
}

export default function ToastItem({ t, title, message, type = "custom" }: ToastItemProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (t.visible) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [t.visible]);

    const getIcon = () => {
        switch (type) {
            case "success":
                return <TickCircle size={24} variant="Bold" color="#22c55e" />;
            case "error":
                return <CloseCircle size={24} variant="Bold" color="#ef4444" />;
            case "loading":
                return (
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                );
            default:
                return <InfoCircle size={24} variant="Bold" color="currentColor" className="text-primary" />;
        }
    };

    const getBorderColor = () => {
        switch (type) {
            case "success":
                return "border-green-500/20";
            case "error":
                return "border-red-500/20";
            default:
                return "border-primary/20";
        }
    };

    return (
        <div
            className={`${isVisible ? "animate-enter" : "animate-leave"
                } max-w-md w-full bg-background/80 backdrop-blur-md shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black/5 dark:ring-white/10 overflow-hidden border ${getBorderColor()} transition-all duration-300 transform`}
        >
            <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                        {getIcon()}
                    </div>
                    <div className="ml-3 flex-1">
                        {title && (
                            <p className="text-sm font-medium text-foreground">
                                {title}
                            </p>
                        )}
                        <p className={`text-sm text-foreground/70 ${title ? "mt-1" : ""}`}>
                            {message}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex border-l border-foreground/5">
                <button
                    onClick={() => hotToast.dismiss(t.id)}
                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-foreground/50 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <CloseSquare size={20} variant="Outline" />
                </button>
            </div>
        </div>
    );
}
