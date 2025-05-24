"use client";

import AuthGuard from "@/components/auth/auth-guard";
import { AvatarMenu } from "@/components/avatar-menu";
import { ChannelSwitcher } from "@/components/chat/channel-switcher";
import ChatBubble from "@/components/chat/chat-bubble";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/api";
import { Channel, MessageResponse, UserResponse } from "@/lib/types";
import { useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useEffect,
  useOptimistic,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const DEFAULT_CHANNELS = ["general", "food", "random"];
const DEFAULT_ACTIVE_CHANNEL = "general";

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

  const [channels, setChannels] = useState<string[]>(DEFAULT_CHANNELS);

  const [lastChannel, setLastChannel] = useState<string>(
    DEFAULT_ACTIVE_CHANNEL,
  );
  const [currentChannel, setCurrentChannel] = useState<string>(
    DEFAULT_ACTIVE_CHANNEL,
  );

  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<MessageResponse[]>([]);

  const socketInitialized = useRef(false);

  // Get access token and user
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

  // Get channels from API
  useEffect(() => {
    const fetchChannels = async () => {
      const response = await api.get("channels", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        console.log("Failed to load channels");
        return;
      }

      const channels = (await response.json()) as Channel[];
      setChannels(channels.map((channel) => channel.name));
    };

    if (accessToken) {
      fetchChannels();
    }
  }, [accessToken]);

  // Connect to socket server
  useEffect(() => {
    if (
      accessToken &&
      (!socketInitialized.current || currentChannel !== lastChannel)
    ) {
      if (socket) {
        socket.disconnect();
      }

      const newSocket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
        auth: {
          token: accessToken,
        },
        transports: ["polling"],
        withCredentials: true,
      });

      newSocket.on("connect", () => {
        newSocket.emit("joinChannel", currentChannel);
      });

      newSocket.on("message", (newMessage: MessageResponse) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, currentChannel]);

  const fetchMessages = async (channel: string) => {
    const response = await api.get(`messages/${channel}`, {
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

  // Fetch message history
  useEffect(() => {
    if (accessToken) {
      fetchMessages(currentChannel);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, currentChannel]);

  return (
    <AuthGuard>
      <div className="flex min-h-svh lg:h-svh items-center justify-center p-6 md:p-10">
        <div className="flex justify-center gap-3 w-full">
          <ChannelSwitcher
            channels={channels}
            activeChannel={currentChannel}
            onChannelChange={(channel) => {
              setLastChannel(currentChannel);
              setCurrentChannel(channel);
              if (socket) {
                socket.emit("joinChannel", channel);
              }
            }}
            className="flex-col"
          />
          <div className="w-full max-w-9/10 lg:max-w-5/10">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <h1 className="text-2xl">Chat</h1>
                  <AvatarMenu user={user} />
                </CardTitle>
                <CardDescription>
                  Bienvenue dans <strong>#{currentChannel}</strong> !
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChatArea
                  channel={currentChannel}
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
  channel: string;
  messages: MessageResponse[];
  setMessages: Dispatch<SetStateAction<MessageResponse[]>>;
  user: UserResponse;
  socket: Socket | null;
}

function ChatArea({
  channel,
  messages,
  setMessages,
  user,
  socket,
}: ChatAreaProps) {
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
          "message",
          {
            channel: channel,
            content: messageInput,
          },
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
        channel,
        content: newMessage as string,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fromUser: {
          identifier: uuidv4(),
          username: user.username,
          email: user.email,
          profilePictureUrl: user.profilePictureUrl || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      ...state,
    ]
  );

  return (
    <>
      <ScrollArea type="auto" className="h-[65svh] lg:px-5">
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
