"use client";

import { InputHTMLAttributes, useId, useState } from "react";
import { ImagePlusIcon } from "lucide-react";
import { FileWithPreview, useFileUpload } from "@/hooks/use-file-upload";
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
import { UploadUrlResponseType, UserResponse } from "@/lib/types";
import { api } from "@/lib/api";
import { toast } from "sonner";
import ky from "ky";

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

    // Get Upload URL from backend
    const uploadUrlResponse = await api.get(
      `documents/upload/${DOCUMENT_CATEGORY}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
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
      },
    });

    if (!response.ok) {
      toast.error("Erreur lors de la mise à jour du profil");
      return;
    }

    const updatedUser = await response.json();
    localStorage.setItem("user", JSON.stringify(updatedUser));

    toast.success("Profil mis à jour avec succès");
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
            </form>
          </div>
        </div>
        <DialogFooter className="border-t px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Annuler
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={handleSubmit}>
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

const DOCUMENT_CATEGORY = "profile-pictures";

interface AvatarProps {
  files: FileWithPreview[];
  openFileDialog: () => void;
  getInputProps: () => InputHTMLAttributes<HTMLInputElement>; // partial typing
}

function Avatar({ files, openFileDialog, getInputProps }: AvatarProps) {
  const currentImage = files[0]?.preview || null;

  return (
    <div className="-mt-10 px-6">
      <div className="border-background bg-muted relative flex size-20 items-center justify-center overflow-hidden rounded-full border-4 shadow-xs shadow-black/10">
        {currentImage && (
          <img
            src={currentImage}
            className="size-full object-cover"
            width={80}
            height={80}
            alt="Profile image"
          />
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
