"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
import {  Upload } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ResourceTable, ColumnDef } from "./ResourceTable";
import { ResourceFormDialog, FormFieldDef } from "./ResourceFormDialog";
import { DeleteConfirmationDialog } from "../DeleteConfirmationDialog"; // Make sure this path is correct
import { ResourceViewDialog, ViewFieldDef } from "./ResourceViewDialog";
import { AsyncThunk } from "@reduxjs/toolkit";

export type ResourceItem = { _id: string; name: string; email: string; [key: string]: any };

export interface ResourceConfig<T extends ResourceItem> {
  noun: string;
  nounPlural: string;
  sliceName: keyof RootState;
  columns: ColumnDef<T>[];
  viewFields: ViewFieldDef<T>[];
  formFields: FormFieldDef[];
  formSchema: any;
  enableImport?: boolean;
  reduxActions: {
    fetch: AsyncThunk<any, any, any>;
    add: AsyncThunk<any, any, any>;
    update: AsyncThunk<any, any, any>;
    delete: AsyncThunk<any, any, any>;
  };
}

interface ResourceClientProps<T extends ResourceItem> {
  config: ResourceConfig<T>;
}

export function ResourceClient<T extends ResourceItem>({ config }: ResourceClientProps<T>) {
  const dispatch = useDispatch<AppDispatch>();
  
   const { items, status, totalItems, totalPages, currentPage } = useSelector(
    (state: RootState) => {
      const sliceState = state[config.sliceName] as any;
      const itemsKey = config.nounPlural.toLowerCase();      
      const totalItemsKey = `total${config.nounPlural}`;
      return {
        items: sliceState[itemsKey] || [],  
        status: sliceState.status,
        totalItems: sliceState[totalItemsKey] || 0,
        totalPages: sliceState.totalPages,
        currentPage: sliceState.currentPage,
      };
    }
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  useEffect(() => {
    dispatch(config.reduxActions.fetch({ page: 1, limit: 10 }));
  }, [dispatch, config.reduxActions.fetch]); 

  const handlePageChange = (direction: "next" | "prev") => {
    const newPage = direction === "next" ? currentPage + 1 : currentPage - 1;
    if (newPage > 0 && newPage <= totalPages) {
      dispatch(config.reduxActions.fetch({ page: newPage, limit: 10 }));
    }
  };

  const handleAddItem = () => { setSelectedItem(null); setIsFormOpen(true); };
  const handleViewItem = (item: T) => { setSelectedItem(item); setIsViewOpen(true); };
  const handleEditItem = (item: T) => { setSelectedItem(item); setIsFormOpen(true); };
  const handleDeleteItem = (item: T) => { setSelectedItem(item); setIsDeleteConfirmOpen(true); };

  const confirmDelete = () => {
    if (!selectedItem) return;

    const promise = dispatch(config.reduxActions.delete(selectedItem._id)).unwrap();

    toast.promise(promise, {
      loading: `Deleting ${config.noun.toLowerCase()}...`,
      success: () => {
        if (items.length === 1 && currentPage > 1) {
          handlePageChange("prev");
        }
        return `${config.noun} "${selectedItem.name}" deleted successfully.`;
      },
      error: (err) => `Failed to delete ${config.noun.toLowerCase()}: ${err.message}`,
    });

    setIsDeleteConfirmOpen(false);
    setSelectedItem(null);
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-xl">{config.nounPlural}</CardTitle>
            </div>
            { config.noun.toLowerCase()!=="contact" && <Button size="sm" className="h-9 gap-1 bg-gray-00 text-white bg-black hover:cursor-pointer" onClick={handleAddItem}>
                  <PlusCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Add {config.noun}</span>
              </Button>
            }
          </div>
        </CardHeader>
        <CardContent>
          <ResourceTable<T>
            items={items}
            columns={config.columns}
            isLoading={status === 'loading'}
            onView={handleViewItem}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
          />
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Showing <strong>{items.length > 0 ? (currentPage - 1) * 10 + 1 : 0}-{(currentPage - 1) * 10 + items.length}</strong> of <strong>{totalItems}</strong> {config.nounPlural.toLowerCase()}
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" onClick={() => handlePageChange("prev")} className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""} />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" onClick={() => handlePageChange("next")} className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>

      <ResourceViewDialog<T>
        isOpen={isViewOpen}
        onOpenChange={setIsViewOpen}
        item={selectedItem}
        fields={config.viewFields}
      />
      <ResourceFormDialog<T>
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        item={selectedItem}
        config={config}
      />
      <DeleteConfirmationDialog
        isOpen={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        onConfirm={confirmDelete}
        userName={selectedItem?.name || ""}
      />
    </>
  );
}

