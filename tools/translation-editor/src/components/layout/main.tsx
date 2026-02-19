import { cn } from "@/lib/utils";

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
}

export function Main({ fixed, className, children, ...props }: MainProps) {
  return (
    <main
      id="main-content"
      className={cn(
        "flex flex-1 flex-col overflow-hidden",
        fixed && "h-svh overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </main>
  );
}
