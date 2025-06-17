// app/dashboard/users/page.tsx
"use client";
import { ResourceClient, ResourceConfig } from "@/components/(dashboard)/components/common/ResourceClient";
import type { User } from "@/lib/services/userService";
import { fetchUsers, addNewUser, updateUser, deleteUser } from "@/lib/redux/userSlice";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const getInitials = (name: string = "") => {
  const names = name.split(" ");
  return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase();
};

const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phoneNumber: z.string().min(10, "Phone number is too short."),
  role: z.enum(["sales", "developer", "admin"]),
  password: z.string().optional(),
}).refine((data) => !data.password || data.password.length >= 4, {
  message: "Password must be at least 4 characters.",
  path: ["password"],
});

const userConfig: ResourceConfig<User> = {
  noun: "User",
  nounPlural: "Users",
  sliceName: "users",
  reduxActions: { fetch: fetchUsers, add: addNewUser, update: updateUser, delete: deleteUser },
  formSchema: userFormSchema,
  columns: [
    {
      accessorKey: "name",
      header: "User",
      cell: (item) => (
        <div className="flex items-center gap-3">
          <Avatar><AvatarImage src="" /><AvatarFallback className="bg-slate-200">{getInitials(item.name)}</AvatarFallback></Avatar>
          <div><div className="font-medium">{item.name}</div><div className="text-sm text-muted-foreground">{item.email}</div></div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: (item) => <Badge variant="secondary" className={cn("capitalize", item.role === 'admin' && 'bg-purple-100 text-purple-700', item.role === 'developer' && 'bg-blue-100 text-blue-700')}>{item.role}</Badge>,
    },
    { accessorKey: "phoneNumber", header: "Phone", cell: (item) => <span className="text-muted-foreground">{item.phoneNumber}</span> }
  ],
  viewFields: [
    { label: "Phone Number", render: (item) => item.phoneNumber },
    { label: "Role", render: (item) => <Badge variant="secondary" className={cn("capitalize", item.role === 'admin' && 'bg-purple-100 text-purple-700', item.role === 'developer' && 'bg-blue-100 text-blue-700')}>{item.role}</Badge> },
    { label: "User Since", render: (item) => new Date(Number(item.createdOn)).toLocaleString() },
    { label: "Last Updated", render: (item) => new Date(Number(item.updatedOn)).toLocaleString() },
  ],
  formFields: [
    { name: "name", label: "Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "phoneNumber", label: "Phone Number", type: "text" },
    { name: "password", label: "Password", type: "password", isHidden: (isEditMode) => isEditMode },
    { name: "role", label: "Role", type: "select", options: [{ value: "sales", label: "Sales" }, { value: "developer", label: "Developer" }, { value: "admin", label: "Admin" }] },
  ]
};

export default function UsersPage() {
  return <ResourceClient config={userConfig} />;
}