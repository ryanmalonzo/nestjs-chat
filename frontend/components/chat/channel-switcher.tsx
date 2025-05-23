import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ChannelButtonProps {
  name: string;
  active: boolean;
  setActive: (channel: string) => void;
}

function ChannelButton({ name, active, setActive }: ChannelButtonProps) {
  const firstLetter = name.charAt(0).toUpperCase();

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => setActive(name)}
          >
            <div className="flex items-center rounded-xl border p-2">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-sm text-xl font-bold bg-muted",
                  {
                    "text-muted-foreground opacity-50": !active,
                  },
                )}
              >
                {firstLetter}
              </div>
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent className="px-2 py-1 text-xs">#{name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export interface ChannelSwitcherProps {
  channels: string[];
  activeChannel: string;
  onChannelChange: (channel: string) => void;
  className?: string;
}

export function ChannelSwitcher({
  channels,
  activeChannel,
  onChannelChange,
  className,
}: ChannelSwitcherProps) {
  const setActive = (channel: string) => {
    onChannelChange(channel);
  };

  return (
    <div>
      <div className={cn("flex gap-2", className)}>
        {channels.map((channel) => (
          <ChannelButton
            key={channel}
            name={channel}
            active={channel === activeChannel}
            setActive={setActive}
          />
        ))}
      </div>
    </div>
  );
}
