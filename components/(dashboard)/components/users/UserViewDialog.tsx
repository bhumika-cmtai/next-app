"use client";

import type { User } from "@/lib/services/userService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const getInitials = (name: string) => {
  const names = name.split(" ");
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

interface UserViewDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  user: User | null;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 items-center gap-4 border-b pb-3">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="col-span-2 text-sm text-slate-800">{value}</div>
    </div>
  );
}

export function UserViewDialog({ isOpen, onOpenChange, user }: UserViewDialogProps) {
  if (!user) return null;

  const createdDate = new Date(Number(user.createdOn)).toLocaleString();
  const updatedDate = new Date(Number(user.updatedOn)).toLocaleString();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src="" alt={user.name} />
            <AvatarFallback className="text-2xl bg-slate-200 font-medium text-slate-600">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <DialogTitle className="mt-4 text-2xl">{user.name}</DialogTitle>
          <DialogDescription>{user.email}</DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3 pt-4 border-t">
          <InfoRow label="Phone Number" value={user.phoneNumber} />
          <InfoRow
            label="Role"
            value={
              <Badge
                variant="secondary"
                className={cn(
                  "capitalize",
                  user.role === "admin" && "bg-purple-100 text-purple-700",
                  user.role === "developer" && "bg-blue-100 text-blue-700",
                  user.role === "sales" && "bg-green-100 text-green-700"
                )}
              >
                {user.role}
              </Badge>
            }
          />
          <InfoRow label="User Since" value={createdDate} />
          <InfoRow label="Last Updated" value={updatedDate} />
        </div>
      </DialogContent>
    </Dialog>
  );
}