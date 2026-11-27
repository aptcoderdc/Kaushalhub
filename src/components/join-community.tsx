import { createContext, useContext, useState, type MouseEvent, type ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { CommunityForm } from "@/components/ApplyForm";
import { cn } from "@/lib/utils";

/**
 * "Join the Community" popup. One dialog for the whole site, opened by any JoinCommunityLink.
 * Links still point at /community, so they work without JavaScript, when opened in a new tab,
 * and for search engines; a normal click opens the popup instead.
 */
const JoinCommunityContext = createContext<(() => void) | null>(null);

export function JoinCommunityProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  // A fresh form each time the popup opens, so a finished submission doesn't linger.
  const [session, setSession] = useState(0);
  const show = () => {
    setSession((value) => value + 1);
    setOpen(true);
  };

  return (
    <JoinCommunityContext.Provider value={show}>
      {children}
      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-navy/55 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
          <DialogPrimitive.Content
            aria-describedby="join-community-description"
            className={cn(
              "fixed z-[60] flex flex-col overflow-hidden bg-background shadow-float outline-none",
              // Phones: a sheet rising from the bottom. Larger screens: a centred panel.
              "inset-x-0 bottom-0 max-h-[92dvh] rounded-t-3xl",
              "sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:max-h-[88dvh] sm:w-[min(680px,calc(100vw-48px))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl",
              "data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-8 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom-4 sm:data-[state=open]:slide-in-from-bottom-0 sm:data-[state=open]:zoom-in-95 sm:data-[state=open]:fade-in-0",
              "motion-reduce:animate-none",
            )}
          >
            <div className="kh-surface-navy relative shrink-0 overflow-hidden bg-navy px-6 pb-6 pt-5 sm:px-8 sm:pt-7">
              <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-saffron/20 blur-3xl" />
              <span aria-hidden="true" className="mx-auto mb-4 block h-1 w-10 rounded-full bg-primary-foreground/30 sm:hidden" />
              <p className="eyebrow relative !text-saffron">The Kaushal Hub Community</p>
              <DialogPrimitive.Title className="relative mt-2 pr-12 font-serif text-[26px] leading-8 !text-primary-foreground sm:text-[30px] sm:leading-9">
                Join the Community
              </DialogPrimitive.Title>
              <DialogPrimitive.Description id="join-community-description" className="relative mt-2 max-w-lg text-[15px] leading-6 text-primary-foreground/75">
                Connect with people who are learning, building and sharing expertise, and hear about
                resources, learning initiatives and ways to participate.
              </DialogPrimitive.Description>
              <DialogPrimitive.Close
                aria-label="Close"
                className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground sm:right-5 sm:top-5"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </DialogPrimitive.Close>
            </div>
            <div className="overflow-y-auto overscroll-contain px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] pt-6 sm:px-8 sm:pb-8">
              <CommunityForm key={session} onDone={() => setOpen(false)} />
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </JoinCommunityContext.Provider>
  );
}

/** Click handler for a /community link: opens the popup for a plain click, otherwise leaves the link alone. */
export function useJoinCommunityClick() {
  const open = useContext(JoinCommunityContext);
  return (event: MouseEvent<HTMLElement>) => {
    if (!open || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    open();
  };
}
