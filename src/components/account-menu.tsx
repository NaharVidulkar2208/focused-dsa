import { Link, useNavigate } from "@tanstack/react-router";
import { User as UserIcon, LogOut, LogIn, UserPlus, Ghost, Home } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AccountMenu() {
  const { user, guest, displayName, enterGuest, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    navigate({ to: "/", replace: true });
  };

  const initials = displayName
    ? displayName.slice(0, 2).toUpperCase()
    : null;

  return (
    <div className="flex items-center gap-2">
      {guest && !user && (
        <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
          Guest
        </span>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label="Account"
            className={`grid h-9 w-9 place-items-center rounded-full border text-sm font-semibold transition ${
              user
                ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25"
                : "border-border bg-card/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            {initials ?? <UserIcon className="h-4 w-4" />}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem asChild>
            <Link to="/" className="cursor-pointer">
              <Home className="mr-2 h-4 w-4" /> Home
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {user ? (
            <>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                {displayName && (
                  <div className="mb-0.5 font-semibold text-foreground">{displayName}</div>
                )}
                <div className="truncate">{user.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-zinc-400 focus:text-zinc-200">
                <LogOut className="mr-2 h-4 w-4" /> Sign out
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem asChild>
                <Link to="/login" className="cursor-pointer">
                  <LogIn className="mr-2 h-4 w-4" /> Sign in
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/login" search={{ mode: "signup" } as never} className="cursor-pointer">
                  <UserPlus className="mr-2 h-4 w-4" /> Create account
                </Link>
              </DropdownMenuItem>
              {!guest && (
                <DropdownMenuItem
                  onClick={() => {
                    enterGuest();
                    toast.success("Exploring as guest");
                  }}
                  className="cursor-pointer"
                >
                  <Ghost className="mr-2 h-4 w-4" /> Guest mode
                </DropdownMenuItem>
              )}
              {guest && (
                <DropdownMenuItem disabled className="text-muted-foreground/60">
                  <Ghost className="mr-2 h-4 w-4" /> Guest mode active
                </DropdownMenuItem>
              )}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
