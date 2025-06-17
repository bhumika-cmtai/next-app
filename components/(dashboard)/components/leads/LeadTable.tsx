import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Pencil, Trash2, Eye, UserX } from "lucide-react";
import type { Lead } from "@/lib/services/leadService";
import { cn } from "@/lib/utils";

interface LeadTableProps { leads: Lead[]; isLoading: boolean; onView: (lead: Lead) => void; onEdit: (lead: Lead) => void; onDelete: (lead: Lead) => void; }
const getInitials = (name: string) => { const names = name.split(" "); return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase(); };

export function LeadTable({ leads, isLoading, onEdit, onView ,onDelete }: LeadTableProps) {
  const renderSkeleton = () => (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </TableCell>
      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
      <TableCell><Skeleton className="h-6 w-16 rounded-md" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
    </TableRow>
  );

  return (
    <div className="rounded-md border"><Table>
      <TableHeader><TableRow><TableHead className="w-[300px]">Lead</TableHead><TableHead>Status</TableHead><TableHead>Phone</TableHead><TableHead><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader>
      <TableBody>
        {isLoading ? renderSkeleton() : leads.length > 0 ? (
          leads.map((lead) => (
            <TableRow key={lead._id}>
              <TableCell><div className="flex items-center gap-3"><Avatar><AvatarImage src="" alt={lead.name} /><AvatarFallback className="bg-slate-200 font-medium text-slate-600">{getInitials(lead.name)}</AvatarFallback></Avatar><div><div className="font-medium text-slate-800">{lead.name}</div><div className="text-sm text-muted-foreground">{lead.email}</div></div></div></TableCell>
              <TableCell>
                <Badge variant="secondary" className={cn(
                  "capitalize",
                  lead.status === 'New' && 'bg-blue-100 text-blue-700',
                  lead.status === 'Contacted' && 'bg-green-100 text-green-700',
                  lead.status === 'NotInterested' && 'bg-red-100 text-red-700'
                )}>
                  {lead.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{lead.phoneNumber}</TableCell>
              <TableCell align="right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel><DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => onView(lead)}><Eye className="mr-2 h-4 w-4" /><span>View</span></DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onEdit(lead)}><Pencil className="mr-2 h-4 w-4" /><span>Edit</span></DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onDelete(lead)} className="text-red-600 focus:text-red-600 focus:bg-red-50"><Trash2 className="mr-2 h-4 w-4" /><span>Delete</span></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : ( <TableRow><TableCell colSpan={4} className="h-48 text-center"><div className="flex flex-col items-center gap-2"><UserX className="h-12 w-12 text-muted-foreground" /><h3 className="text-xl font-semibold">No Leads Found</h3><p className="text-muted-foreground">Try adding a new lead to see them here.</p></div></TableCell></TableRow> )}
      </TableBody>
    </Table></div>
  );
}