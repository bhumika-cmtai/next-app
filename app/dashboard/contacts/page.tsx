"use client";
import { ResourceClient, ResourceConfig } from "@/components/(dashboard)/components/common/ResourceClient";
import type { Contact } from "@/lib/services/contactService";
import { fetchContacts, addNewContact, updateContact, deleteContact } from "@/lib/redux/contactSlice";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const getInitials = (name: string = "") => {
  const names = name.split(" ");
  return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase();
};


const CONTACT_STATUSES = ['New', 'Contacted', 'NotInterested'] as const;


const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phoneNumber: z.string().min(10, "Phone number is too short."),
  status: z.enum(CONTACT_STATUSES),
  message: z.string().min(5, "Message must be at least 5 characters."),
});

const contactConfig: ResourceConfig<Contact> = {
  noun: "Contact",
  nounPlural: "Contacts",
  sliceName: "contacts",
  reduxActions: { fetch: fetchContacts, add: addNewContact, update: updateContact, delete: deleteContact },
  formSchema: contactFormSchema,
  
  columns: [
    {
      accessorKey: "name",
      header: "Contact",
      cell: (item) => (
        <div className="flex items-center gap-3">
          <Avatar><AvatarImage src="" /><AvatarFallback className="bg-slate-200">{getInitials(item.name)}</AvatarFallback></Avatar>
          <div><div className="font-medium">{item.name}</div><div className="text-sm text-muted-foreground">{item.email}</div></div>
        </div>
      ),
    },
    {
      accessorKey: "message",
      header: "Message",
      cell: (item) => <p className="text-sm text-muted-foreground truncate max-w-xs">{item.message}</p>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (item) => <Badge variant="secondary" className={cn("capitalize", item.status === 'New' && 'bg-blue-100 text-blue-700', item.status === 'Contacted' && 'bg-yellow-100 text-yellow-700', item.status === 'NotInterested' && 'bg-red-100 text-red-700')}>{item.status.replace(/([A-Z])/g, ' $1').trim()}</Badge>,
    },
  ],
  
  viewFields: [
    { label: "Phone Number", render: (item) => item.phoneNumber },
    { label: "Status", render: (item) => <Badge variant="secondary" className={cn("capitalize", item.status === 'New' && 'bg-blue-100 text-blue-700', item.status === 'Contacted' && 'bg-yellow-100 text-yellow-700', item.status === 'NotInterested' && 'bg-red-100 text-red-700')}>{item.status.replace(/([A-Z])/g, ' $1').trim()}</Badge> },
    { label: "Full Message", render: (item) => <p className="text-sm leading-relaxed">{item.message}</p> },
    { label: "Received On", render: (item) => new Date(Number(item.createdOn)).toLocaleString() },
  ],
  
  formFields: [
    { name: "name", label: "Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "phoneNumber", label: "Phone Number", type: "text" },
    { name: "message", label: "Message", type: "text" },
    {
      name: "status",
      label: "Status",
      type: "select",

      options: CONTACT_STATUSES.map(status => ({
        value: status,
        label: status.replace(/([A-Z])/g, ' $1').trim()
      }))
    },
  ]
};

export default function ContactsPage() {
  return <ResourceClient config={contactConfig} />;
}