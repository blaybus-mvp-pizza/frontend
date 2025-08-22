import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@workspace/ui/lib/utils";

const typographyVariants = cva("font-['Pretendard_Variable']", {
  variants: {
    variant: {
      h1: "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight",
      h2: "text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight",
      h3: "text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight",
      h4: "text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight",
      h5: "text-lg md:text-xl lg:text-2xl font-semibold tracking-tight",
      h6: "text-base md:text-lg lg:text-xl font-semibold tracking-tight",
      body1: "text-base md:text-lg font-normal",
      body2: "text-sm md:text-base font-normal",
      body3: "text-xs md:text-sm font-normal",
      subtitle1: "text-base md:text-lg font-medium",
      subtitle2: "text-sm md:text-base font-medium",
      caption: "text-xs md:text-sm font-normal text-muted-foreground",
      overline: "text-xs md:text-sm font-medium uppercase tracking-wider",
      label: "text-sm md:text-base font-medium",
      button: "text-xs md:text-sm font-medium",
      sub: "text-sm font-medium leading-[140%] text-[#767676]",
      first: "text-xl font-bold leading-[140%] text-[#111111]",
      second: "text-lg font-semibold tracking-[-0.025em] leading-[150%] text-[#111111]",
    },
    color: {
      default: "text-foreground",
      primary: "text-primary",
      secondary: "text-secondary-foreground",
      muted: "text-muted-foreground",
      destructive: "text-destructive",
      success: "text-green-600 dark:text-green-400",
      warning: "text-yellow-600 dark:text-yellow-400",
      info: "text-blue-600 dark:text-blue-400",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
    weight: {
      thin: "font-thin",
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
      black: "font-black",
    },
    lineClamp: {
      1: "line-clamp-1",
      2: "line-clamp-2",
      3: "line-clamp-3",
      4: "line-clamp-4",
      5: "line-clamp-5",
      6: "line-clamp-6",
      none: "",
    },
    truncate: {
      true: "truncate",
      false: "",
    },
  },
  defaultVariants: {
    variant: "body1",
    color: "default",
    align: "left",
    weight: "normal",
    lineClamp: "none",
    truncate: false,
  },
});

export interface TypographyProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof typographyVariants> {
  as?: keyof React.JSX.IntrinsicElements;
  children?: React.ReactNode;
}

const variantElementMap: Record<string, keyof React.JSX.IntrinsicElements> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  body1: "p",
  body2: "p",
  body3: "p",
  subtitle1: "p",
  subtitle2: "p",
  caption: "span",
  overline: "span",
  label: "label",
  button: "span",
  sub: "p",
  first: "p",
  second: "p",
};

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  (
    {
      className,
      variant = "body1",
      align,
      weight,
      lineClamp,
      truncate,
      as,
      ...props
    },
    ref
  ) => {
    const Component = (as ||
      variantElementMap[variant as string] ||
      "p") as any;

    return (
      <Component
        className={cn(
          typographyVariants({
            align,
            weight,
            lineClamp,
            truncate,
            className,
            variant,
          })
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Typography.displayName = "Typography";

export { Typography, typographyVariants };
