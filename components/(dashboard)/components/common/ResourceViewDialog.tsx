"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ResourceItem } from "./ResourceClient";
import { ReactNode } from "react";

export interface ViewFieldDef<T extends ResourceItem> {
  label: string;
  render: (item: T) => ReactNode; 
}

interface ResourceViewDialogProps<T extends ResourceItem> {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  item: T | null;
  fields: ViewFieldDef<T>[];
}

const getInitials = (name: string = "") => {
  const names = name.split(" ");
  return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase();
};

const InfoRow = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="grid grid-cols-3 items-center gap-4 border-b pb-3 last:border-b-0">
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <div className="col-span-2 text-sm text-slate-800">{value}</div>
  </div>
);

export function ResourceViewDialog<T extends ResourceItem>({ isOpen, onOpenChange, item, fields }: ResourceViewDialogProps<T>) {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20"><AvatarImage src="" alt={item.name} /><AvatarFallback className="text-2xl bg-slate-200 font-medium text-slate-600">{getInitials(item.name)}</AvatarFallback></Avatar>
          <DialogTitle className="mt-4 text-2xl">{item.name}</DialogTitle>
          <DialogDescription>{item.email}</DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-3 pt-4 border-t">
          {fields.map((field, index) => (
            <InfoRow key={index} label={field.label} value={field.render(item)} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}