"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import AuthGuard from "@/components/auth/auth-guard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Chat() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketInitialized = useRef(false);

  useEffect(() => {
    if (!socketInitialized.current) {
      const newSocket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
        extraHeaders: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        transports: ["polling"],
        withCredentials: true,
      });

      newSocket.on("connect", () => {
        console.log("Socket connected");
        newSocket.emit("general", `Hello from ${newSocket.id}!`);
      });

      setSocket(newSocket);
      socketInitialized.current = true;
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <AuthGuard>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-6/10">
          <div className="flex flex-col gap-6">
            <Card className="h-[80svh]">
              <CardHeader>
                <CardTitle className="text-2xl">Chat</CardTitle>
                <CardDescription>
                  Bienvenue dans <strong>#general</strong> !
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
