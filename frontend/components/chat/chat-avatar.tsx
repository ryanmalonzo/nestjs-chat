import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRoundIcon } from "lucide-react";

export function ChatAvatar({
  url,
  size = "sm",
}: {
  url?: string | null;
  size?: "sm" | "md";
}) {
  const sizeClasses = size === "md" ? "size-8" : "size-6";
  const iconSize = size === "md" ? 20 : 16;

  return (
    <Avatar className={`rounded-md ${sizeClasses}`}>
      <AvatarImage
        src={url || undefined}
        alt="Profile Picture"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
      <AvatarFallback>
        <UserRoundIcon
          size={iconSize}
          className="opacity-60"
          aria-hidden="true"
        />
      </AvatarFallback>
    </Avatar>
  );
}
