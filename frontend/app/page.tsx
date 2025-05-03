"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import AuthGuard from "@/components/auth/auth-guard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import { MessageResponse } from "@/lib/types";
import ChatBubble from "@/components/chat/chat-bubble";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Chat() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<MessageResponse[]>([]);

  const scrollAreaRef = useRef(null);

  const socketInitialized = useRef(false);

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

  // Get email and access token
  useEffect(() => {
    if (router) {
      const localEmail = localStorage.getItem("email");
      const localAccessToken = localStorage.getItem("accessToken");

      if (!localEmail || !localAccessToken) {
        router.push("/login");
        return;
      }

      setEmail(localEmail);
      setAccessToken(localAccessToken);
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
        console.log("Failed loading messages");
        return;
      }

      const messages = await response.json();

      setMessages(messages as MessageResponse[]);
    };

    if (accessToken) {
      fetchMessages();
    }
  }, [accessToken]);

  // Automatically scroll to bottom with new messages
  useEffect(() => {
    scrollToBottom(scrollAreaRef.current);
  }, [messages]);

  return (
    <AuthGuard>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-9/10 lg:max-w-5/10">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Chat</CardTitle>
                <CardDescription>
                  Bienvenue dans <strong>#general</strong> !
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea type="auto" className="h-[70svh] lg:px-5">
                  <div className="space-y-5" ref={scrollAreaRef}>
                    {messages.length > 0 &&
                      messages.map((message) => (
                        <ChatBubble
                          key={message.identifier}
                          userEmail={email}
                          message={message}
                        />
                      ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
