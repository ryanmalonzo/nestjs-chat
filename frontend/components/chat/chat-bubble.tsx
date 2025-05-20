import { MessageResponse } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  userIdentifier: string;
  message: MessageResponse;
}

export default function ChatBubble({
  userIdentifier,
  message,
}: ChatBubbleProps) {
  const isOwnMessage = userIdentifier === message.fromUser.identifier;
  const extraBubbleClasses = isOwnMessage ? "self-end" : "self-start bg-muted";
  const extraMetadataClasses = isOwnMessage ? "self-end ml-0 mr-2" : "";

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
      <p
        className={cn(
          "text-xs text-gray-500 mb-1 ml-2 font-medium",
          extraMetadataClasses,
        )}
      >
        {isOwnMessage ? "Moi" : message.fromUser.username}
      </p>
      <div
        className={cn(
          "flex lg:max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-primary text-primary-foreground",
          extraBubbleClasses,
        )}
      >
        {message.content}
      </div>
      <p className={cn("text-xs text-gray-500 ml-2", extraMetadataClasses)}>
        {formatDateString(message.createdAt)}
      </p>
    </div>
  );
}
