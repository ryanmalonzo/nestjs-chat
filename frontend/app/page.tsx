"use client";

import {
  useState,
  useEffect,
  useRef,
  useOptimistic,
  startTransition,
  Dispatch,
  SetStateAction,
} from "react";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import AuthGuard from "@/components/auth/auth-guard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import { MessageResponse, UserResponse } from "@/lib/types";
import ChatBubble from "@/components/chat/chat-bubble";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AvatarMenu } from "@/components/avatar-menu";

export default function Chat() {
  const router = useRouter();

  const [accessToken, setAccessToken] = useState("");
  const [user, setUser] = useState<UserResponse>({
    email: "",
    username: "",
    createdAt: "",
    updatedAt: "",
    identifier: "",
  });

  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<MessageResponse[]>([]);

  const socketInitialized = useRef(false);

  // Get email and access token
  useEffect(() => {
    if (router) {
      const localAccessToken = localStorage.getItem("accessToken");
      const localUser = localStorage.getItem("user");

      if (!localUser || !localAccessToken) {
        router.push("/login");
        return;
      }

      const user = JSON.parse(localUser) as UserResponse;

      setAccessToken(localAccessToken);
      setUser(user);
    }
  }, [router]);

  // Connect to socket server
  useEffect(() => {
    if (accessToken && !socketInitialized.current) {
      const newSocket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
        extraHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
        transports: ["polling"],
        withCredentials: true,
      });

      newSocket.on("connect", () => {
        console.log("Socket connected");
      });

      newSocket.on("general", (newMessage: MessageResponse) => {
        // Handled by the child ChatArea component
        if (newMessage.fromUser.email === user.email) return;
        setMessages((previousMessages) => [...previousMessages, newMessage]);
      });

      setSocket(newSocket);
      socketInitialized.current = true;
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [accessToken]);

  // Fetch message history
  useEffect(() => {
    const fetchMessages = async () => {
      const response = await api.get("messages/general", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        console.log("Failed to load messages");
        return;
      }

      const messages = await response.json();

      setMessages(messages as MessageResponse[]);
    };

    if (accessToken) {
      fetchMessages();
    }
  }, [accessToken]);

  return (
    <AuthGuard>
      <div className="flex min-h-svh lg:h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-9/10 lg:max-w-5/10">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <h1 className="text-2xl">Chat</h1>
                  <AvatarMenu user={user} />
                </CardTitle>
                <CardDescription>
                  Bienvenue dans <strong>#general</strong> !
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChatArea
                  messages={messages}
                  setMessages={setMessages}
                  user={user}
                  socket={socket}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

interface ChatAreaProps {
  messages: MessageResponse[];
  setMessages: Dispatch<SetStateAction<MessageResponse[]>>;
  user: UserResponse;
  socket: Socket | null;
}

function ChatArea({ messages, setMessages, user, socket }: ChatAreaProps) {
  const [messageInput, setMessageInput] = useState("");

  const scrollAreaRef = useRef(null);

  const scrollToBottom = (container: HTMLElement | null, smooth = false) => {
    if (container?.children.length) {
      const lastElement = container?.lastChild as HTMLElement;

      lastElement?.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "end",
        inline: "nearest",
      });
    }
  };

  // Automatically scroll to bottom with new messages
  useEffect(() => {
    scrollToBottom(scrollAreaRef.current);
  }, [messages]);

  const sendMessage = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!messageInput) {
      return;
    }

    startTransition(() => {
      addOptimisticMessage(messageInput);
    });

    // Reset form
    setMessageInput("");

    startTransition(() => {
      if (socket) {
        socket.emit(
          "general",
          messageInput,
          (messageOutput: MessageResponse) => {
            startTransition(() => {
              setMessages((previousMessages) => [
                ...previousMessages,
                messageOutput,
              ]);
            });
          },
        );
      }
    });
  };

  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      {
        identifier: uuidv4(),
        fromUserIdentifier: uuidv4(),
        channel: "general",
        content: newMessage as string,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fromUser: {
          identifier: uuidv4(),
          username: user.username,
          email: user.email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      ...state,
    ],
  );

  return (
    <>
      <ScrollArea type="auto" className="h-[70svh] lg:px-5">
        <div className="space-y-5" ref={scrollAreaRef}>
          {optimisticMessages.length > 0 &&
            optimisticMessages.map((message) => (
              <ChatBubble
                key={message.identifier}
                userIdentifier={user.identifier}
                message={message}
              />
            ))}
        </div>
      </ScrollArea>
      {/* Input Area */}
      <form className="flex flex-1 gap-3 mt-5" onSubmit={sendMessage}>
        <Input
          id="message"
          name="message"
          placeholder="Taper votre message ici..."
          className="py-5"
          value={messageInput}
          onChange={(event) => {
            setMessageInput(event.target.value);
          }}
        />
        <Button
          type="submit"
          variant="outline"
          size="lg"
          className="py-5 cursor-pointer"
        >
          Envoyer
        </Button>
      </form>
    </>
  );
}
