import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  leftIcon?: React.ComponentType<{
    size?: number;
    color?: string;
    variant?: "Linear" | "Outline" | "Bold" | "Broken" | "Bulk" | "TwoTone";
  }>;
  rightIcon?: React.ComponentType<{
    size?: number;
    color?: string;
    variant?: "Linear" | "Outline" | "Bold" | "Broken" | "Bulk" | "TwoTone";
  }>;
  iconSize?: number;
  iconVariant?: "Linear" | "Outline" | "Bold" | "Broken" | "Bulk" | "TwoTone";
  fullWidth?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      iconSize,
      iconVariant = "Outline",
      fullWidth = false,
      isLoading = false,
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    // Size configurations
    const sizeConfig = {
      sm: {
        padding: "px-4 py-2",
        text: "text-sm",
        icon: iconSize || 18,
      },
      md: {
        padding: "px-5 py-2.5",
        text: "text-base",
        icon: iconSize || 20,
      },
      lg: {
        padding: "px-6 py-3.5",
        text: "text-lg",
        icon: iconSize || 24,
      },
    };

    // Variant configurations
    const variantConfig = {
      primary: {
        base: "bg-primary text-white hover:bg-primary/90",
        disabled: "bg-primary/50 text-white/70 cursor-not-allowed",
      },
      secondary: {
        base: "bg-secondary text-white hover:bg-secondary/90",
        disabled: "bg-secondary/50 text-white/70 cursor-not-allowed",
      },
      outline: {
        base: "border-2 border-foreground/20 text-foreground hover:border-primary hover:text-primary bg-transparent",
        disabled:
          "border-foreground/10 text-foreground/50 cursor-not-allowed hover:border-foreground/10 hover:text-foreground/50",
      },
      ghost: {
        base: "text-foreground/80 hover:text-primary hover:bg-foreground/5 bg-transparent",
        disabled: "text-foreground/30 cursor-not-allowed",
      },
    };

    const isDisabled = disabled || isLoading;
    const currentSize = sizeConfig[size];
    const currentVariant = variantConfig[variant];

    const baseClasses = `
      inline-flex items-center cursor-pointer justify-center gap-2
      rounded-full font-medium
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
      disabled:pointer-events-none
      ${currentSize.padding}
      ${currentSize.text}
      ${isDisabled ? currentVariant.disabled : currentVariant.base}
      ${fullWidth ? "w-full" : ""}
      ${className}
    `.trim().replace(/\s+/g, " ");

    const getIconColor = () => {
      if (isDisabled) {
        if (variant === "primary" || variant === "secondary") return "#ffffffB3";
        return "#1717174D";
      }
      if (variant === "primary" || variant === "secondary") return "#ffffff";
      return "#171717";
    };

    return (
      <button
        ref={ref}
        className={baseClasses}
        disabled={isDisabled}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin"
              width={currentSize.icon}
              height={currentSize.icon}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {LeftIcon && (
              <LeftIcon
                size={currentSize.icon}
                color={getIconColor()}
                variant={iconVariant}
              />
            )}
            {children}
            {RightIcon && (
              <RightIcon
                size={currentSize.icon}
                color={getIconColor()}
                variant={iconVariant}
              />
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

