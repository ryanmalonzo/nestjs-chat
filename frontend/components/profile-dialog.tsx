"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileWithPreview, useFileUpload } from "@/hooks/use-file-upload";
import { api } from "@/lib/api";
import { ChatBubbleColor, UploadUrlResponseType, UserResponse } from "@/lib/types";
import { refreshUserData } from "@/lib/utils";
import ky from "ky";
import { ImagePlusIcon, UserRoundIcon } from "lucide-react";
import Image from "next/image";
import { InputHTMLAttributes, useId, useState } from "react";
import { toast } from "sonner";
import ColorPicker from "./color-picker";

export function ProfileDialog({
  user,
  children,
}: {
  user: UserResponse;
  children: React.ReactNode;
}) {
  const id = useId();

  // Profile Picture
  const [{ files }, { openFileDialog, getInputProps }] = useFileUpload({
    accept: "image/*",
  });

  const handleProfilePictureChange = async () => {
    const file = files[0];
    if (!file) return;

    // Extract file extension
    const fileExtension = file.file.name.split(".").pop()?.toLowerCase();
    if (!fileExtension) {
      toast.error("Extension de fichier invalide");
      return;
    }

    // Get Upload URL from backend
    const uploadUrlResponse = await api.get(
      `users/profile-picture/upload/${fileExtension}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    if (!uploadUrlResponse.ok) {
      toast.error("Erreur lors de la mise à jour de la photo de profil");
      return;
    }

    const { url: uploadUrl } =
      (await uploadUrlResponse.json()) as UploadUrlResponseType;

    // Upload file to S3
    const s3UploadResponse = await ky.put(uploadUrl, {
      headers: {
        "Content-Type": file.file.type,
      },
      body: file.file as File,
    });

    if (!s3UploadResponse.ok) {
      toast.error("Erreur lors de la mise à jour de la photo de profil");
      return;
    }
  };

  // User Fields
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [chatBubbleColor, setChatBubbleColor] = useState<ChatBubbleColor>(user.chatBubbleColor || "red");

  const handleSubmit = async () => {
    // Handle profile picture change
    if (files.length > 0) {
      await handleProfilePictureChange();
    }

    // Handle user fields change
    const response = await api.patch("users/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      json: {
        username,
        email,
        chatBubbleColor,
      },
    });

    if (!response.ok) {
      toast.error("Erreur lors de la mise à jour du profil");
      return;
    }

    const updatedUser = await response.json();
    localStorage.setItem("user", JSON.stringify(updatedUser));

    await refreshUserData();

    toast.success("Profil mis à jour avec succès");

    window.location.reload();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Modifier mon profil
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Make changes to your profile here. You can change your photo and set a
          username.
        </DialogDescription>
        <div className="overflow-y-auto">
          <ProfileBanner />
          <Avatar
            files={files}
            openFileDialog={openFileDialog}
            getInputProps={getInputProps}
            profilePictureUrl={user.profilePictureUrl}
          />
          <div className="px-6 pt-4 pb-6">
            <form className="space-y-4">
              {/* Username */}
              <div className="*:not-first:mt-2">
                <Label htmlFor={`${id}-username`}>Nom d&apos;utilisateur</Label>
                <div className="relative">
                  <Input
                    id={`${id}-username`}
                    className="peer pe-9"
                    placeholder="john.doe"
                    value={username}
                    onChange={(event) => {
                      setUsername(event.target.value);
                    }}
                    type="text"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="*:not-first:mt-2">
                <Label htmlFor={`${id}-email`}>Adresse mail</Label>
                <div className="relative">
                  <Input
                    id={`${id}-email`}
                    className="peer pe-9"
                    placeholder="john.doe@example.com"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                    }}
                    type="text"
                    required
                  />
                </div>
              </div>

              {/* Chat Bubble Color */}
              <div className="*:not-first:mt-2">
                <ColorPicker
                  title="Couleur des bulles de chat"
                  value={chatBubbleColor}
                  onValueChange={setChatBubbleColor}
                />
              </div>
            </form>
          </div>
        </div>
        <DialogFooter className="border-t px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="cursor-pointer">
              Annuler
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              onClick={handleSubmit}
              className="cursor-pointer"
            >
              Sauvegarder
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ProfileBanner() {
  return (
    <div className="h-32">
      <div className="bg-muted relative flex size-full items-center justify-center overflow-hidden" />
    </div>
  );
}

interface AvatarProps {
  files: FileWithPreview[];
  openFileDialog: () => void;
  getInputProps: () => InputHTMLAttributes<HTMLInputElement>; // partial typing
  profilePictureUrl?: string;
}

function Avatar({
  files,
  openFileDialog,
  getInputProps,
  profilePictureUrl,
}: AvatarProps) {
  const currentImage = files[0]?.preview || profilePictureUrl;

  return (
    <div className="-mt-10 px-6">
      <div className="border-background bg-muted relative flex size-20 items-center justify-center overflow-hidden rounded-full border-4 shadow-xs shadow-black/10">
        {currentImage ? (
          <Image
            src={currentImage}
            className="size-full object-cover"
            width={80}
            height={80}
            alt="Profile image"
            onError={(e) => {
              // Hide broken images gracefully
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <UserRoundIcon size={32} className="opacity-60" aria-hidden="true" />
        )}
        <button
          type="button"
          className="focus-visible:border-ring focus-visible:ring-ring/50 absolute flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
          onClick={openFileDialog}
          aria-label="Change profile picture"
        >
          <ImagePlusIcon size={16} aria-hidden="true" />
        </button>
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload profile picture"
        />
      </div>
    </div>
  );
}
