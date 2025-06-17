"use client";
import { ResourceClient,ResourceConfig } from "@/components/(dashboard)/components/common/ResourceClient";
import type { Lead } from "@/lib/services/leadService";
import { fetchLeads, addNewLead, updateLead, deleteLead } from "@/lib/redux/leadSlice";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const getInitials = (name: string = "") => {
  const names = name.split(" ");
  return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase();
};

const leadFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phoneNumber: z.string().min(10, "Phone number is too short."),
  status: z.enum(['New', 'Contacted', 'NotInterested']),
});

const leadConfig: ResourceConfig<Lead> = {
  noun: "Lead",
  nounPlural: "Leads",
  sliceName: "leads",
  reduxActions: { fetch: fetchLeads, add: addNewLead, update: updateLead, delete: deleteLead },
  formSchema: leadFormSchema,
  columns: [
    {
      accessorKey: "name",
      header: "Lead",
      cell: (item) => (
        <div className="flex items-center gap-3">
          <Avatar><AvatarImage src="" /><AvatarFallback className="bg-slate-200">{getInitials(item.name)}</AvatarFallback></Avatar>
          <div><div className="font-medium">{item.name}</div><div className="text-sm text-muted-foreground">{item.email}</div></div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (item) => <Badge variant="secondary" className={cn("capitalize", item.status === 'New' && 'bg-blue-100 text-blue-700', item.status === 'Contacted' && 'bg-green-100 text-green-700', item.status === 'NotInterested' && 'bg-red-100 text-red-700')}>{item.status}</Badge>,
    },
    { accessorKey: "phoneNumber", header: "Phone", cell: (item) => <span className="text-muted-foreground">{item.phoneNumber}</span> }
  ],
  viewFields: [
    { label: "Phone Number", render: (item) => item.phoneNumber },
    { label: "Status", render: (item) => <Badge variant="secondary" className={cn("capitalize", item.status === 'New' && 'bg-blue-100 text-blue-700', item.status === 'Contacted' && 'bg-green-100 text-green-700', item.status === 'NotInterested' && 'bg-red-100 text-red-700')}>{item.status}</Badge> },
    { label: "Lead Since", render: (item) => new Date(Number(item.createdOn)).toLocaleString() },
    { label: "Last Updated", render: (item) => new Date(Number(item.updatedOn)).toLocaleString() },
  ],
  formFields: [
    { name: "name", label: "Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "phoneNumber", label: "Phone Number", type: "text" },
    { name: "status", label: "Status", type: "select", options: [{ value: "New", label: "New" }, { value: "Contacted", label: "Contacted" }, { value: "NotInterested", label: "Not Interested" }] },
  ]
};

export default function LeadsPage() {
  return <ResourceClient config={leadConfig} />;
}