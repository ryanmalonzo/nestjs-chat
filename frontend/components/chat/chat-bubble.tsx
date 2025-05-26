import { ChatBubbleColor, MessageResponse } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChatAvatar } from "./chat-avatar";

const colorClasses: Record<ChatBubbleColor, string> = {
  blue: "bg-blue-500 text-white",
  indigo: "bg-indigo-500 text-white", 
  pink: "bg-pink-500 text-white",
  red: "bg-red-500 text-white",
  orange: "bg-orange-500 text-white",
  amber: "bg-amber-500 text-white",
  emerald: "bg-emerald-500 text-white",
};

interface ChatBubbleProps {
  userIdentifier: string;
  message: MessageResponse;
}

export default function ChatBubble({
  userIdentifier,
  message,
}: ChatBubbleProps) {
  const isOwnMessage = userIdentifier === message.fromUser.identifier;
  const userColor = message.fromUser.chatBubbleColor || "red";
  const bubbleColorClasses = colorClasses[userColor]; // Always use the author's color
  const extraBubbleClasses = isOwnMessage ? "self-end" : "self-start";
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
      <div
        className={cn(
          "flex items-center gap-2 mb-1",
          isOwnMessage ? "justify-end" : "justify-start"
        )}
      >
        {!isOwnMessage && (
          <ChatAvatar url={message.fromUser.profilePictureUrl} />
        )}
        <p
          className={cn(
            "text-xs text-gray-500 font-medium",
            isOwnMessage ? "text-right" : "text-left"
          )}
        >
          {isOwnMessage ? "Moi" : message.fromUser.username}
        </p>
        {isOwnMessage && (
          <ChatAvatar url={message.fromUser.profilePictureUrl} />
        )}
      </div>
      <div
        className={cn(
          "flex lg:max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
          bubbleColorClasses,
          extraBubbleClasses
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
