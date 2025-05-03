import { MessageResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  userEmail: string;
  message: MessageResponse;
}

export default function ChatBubble({ userEmail, message }: ChatBubbleProps) {
  const extraBubbleClasses =
    userEmail === message.fromUser.email ? "self-end" : "bg-muted";
  const extraTimestampClasses =
    userEmail === message.fromUser.email ? "self-end" : "";

  const formatDateString = (dateString: string) => {
    const toDate = new Date(dateString);
    return toDate.toLocaleDateString("fr-FR", {
      weekday: "short",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          "flex lg:w-max lg:max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-primary text-primary-foreground",
          extraBubbleClasses,
        )}
      >
        {message.content}
      </div>
      <p className={cn("text-xs text-gray-500", extraTimestampClasses)}>
        {formatDateString(message.createdAt)}
      </p>
    </div>
  );
}
