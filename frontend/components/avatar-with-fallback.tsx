import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { UserRoundIcon } from "lucide-react"

export function AvatarWithFallback() {
  return (
    <div className="relative">
      <Avatar className="rounded-md">
        <AvatarImage src="./avatar-80-07.jpg" alt="Kelly King" />
        <AvatarFallback>
          <UserRoundIcon size={16} className="opacity-60" aria-hidden="true" />
        </AvatarFallback>
      </Avatar>
      <span className="border-background absolute -end-0.5 -bottom-0.5 size-3 rounded-full border-2 bg-emerald-500">
        <span className="sr-only">Online</span>
      </span>
    </div>
  )
}
