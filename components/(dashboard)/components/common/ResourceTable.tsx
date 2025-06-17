import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal, Pencil, Trash2, Eye, UserX } from "lucide-react";
import { ResourceItem } from "./ResourceClient";

export interface ColumnDef<T> {
  accessorKey: keyof T;
  header: string;
  cell: (item: T) => React.ReactNode;
}

interface ResourceTableProps<T extends ResourceItem> {
  items: T[];
  columns: ColumnDef<T>[];
  isLoading: boolean;
  onView: (item: T) => void;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
}

export function ResourceTable<T extends ResourceItem>({ items, columns, isLoading, onView, onEdit, onDelete }: ResourceTableProps<T>) {
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
      <TableHeader><TableRow>
        {columns.map(col => <TableHead key={String(col.accessorKey)}>{col.header}</TableHead>)}
        <TableHead><span className="sr-only">Actions</span></TableHead>
      </TableRow></TableHeader>
      <TableBody>
        {isLoading ? renderSkeleton() : items.length > 0 ? (
          items.map((item) => (
            <TableRow key={item._id}>
              {columns.map(col => <TableCell key={`${item._id}-${String(col.accessorKey)}`}>{col.cell(item)}</TableCell>)}
              <TableCell align="right">
                <DropdownMenu><DropdownMenuTrigger asChild><Button size="icon" className="hover:cursor-pointer" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => onView(item)} className="focus:bg-purple-50 hover:cursor-pointer"><Eye className="mr-2 h-4 w-4" /><span>View</span></DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => onEdit(item)} className="focus:bg-purple-50 hover:cursor-pointer"><Pencil className="mr-2 h-4 w-4" /><span>Edit</span></DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => onDelete(item)} className="text-red-600 focus:text-red-600 focus:bg-red-50 hover:cursor-pointer"><Trash2 className="mr-2 h-4 w-4" /><span>Delete</span></DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : ( <TableRow><TableCell colSpan={columns.length + 1} className="h-48 text-center"><div className="flex flex-col items-center gap-2"><UserX className="h-12 w-12 text-muted-foreground" /><h3 className="text-xl font-semibold">No Items Found</h3></div></TableCell></TableRow> )}
      </TableBody>
    </Table></div>
  );
  
}