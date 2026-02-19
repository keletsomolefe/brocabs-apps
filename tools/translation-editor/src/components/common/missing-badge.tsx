import { Badge } from "@/components/ui/badge";

export function MissingBadge({ count }: { count: number }) {
  return (
    <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5">
      {count}
    </Badge>
  );
}
