// // app/dashboard/leads/_components/LeadClient.tsx
// "use client";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/lib/store";
// import { fetchLeads, deleteLead } from "@/lib/redux/leadSlice"; 
// import type { Lead } from "@/lib/services/leadService";
// import { toast } from "sonner";
// import { PlusCircle } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
// import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
// import { LeadTable } from "./LeadTable";
// import { LeadFormDialog } from "./LeadFormDialog";
// import { DeleteConfirmationDialog } from "../DeleteConfirmationDialog";

// import { LeadViewDialog } from "./LeadViewDialog";

// export function LeadClient() {
//   const dispatch = useDispatch<AppDispatch>();
//   const { leads, status, totalLeads, totalPages, currentPage } = useSelector((state: RootState) => state.leads);

//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
//   const [isViewOpen, setIsViewOpen] = useState(false);
//   const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

//   useEffect(() => {
//     if (status === "idle") {
//       dispatch(fetchLeads({ page: 1, limit: 10 }));
//     }
//   }, [status, dispatch]);

//   const handlePageChange = (direction: "next" | "prev") => {
//     const newPage = direction === "next" ? currentPage + 1 : currentPage - 1;
//     if (newPage > 0 && newPage <= totalPages) {
//       dispatch(fetchLeads({ page: newPage, limit: 10 }));
//     }
//   };

//   const handleAddLead = () => { setSelectedLead(null); setIsFormOpen(true); };
//   const handleViewLead = (lead: Lead) => { setSelectedLead(lead); setIsViewOpen(true); };
//   const handleEditLead = (lead: Lead) => { setSelectedLead(lead); setIsFormOpen(true); };
//   const handleDeleteLead = (lead: Lead) => { setSelectedLead(lead); setIsDeleteConfirmOpen(true); };

//   const confirmDelete = () => {
//     if (!selectedLead) return;
//     const promise = dispatch(deleteLead(selectedLead._id)).unwrap();
//     toast.promise(promise, {
//       loading: "Deleting lead...",
//       success: () => {
//         if (leads.length === 1 && currentPage > 1) {
//           handlePageChange("prev");
//         }
//         return `Lead "${selectedLead.name}" deleted successfully.`;
//       },
//       error: (err) => `Failed to delete lead: ${err.message}`,
//     });
//     setIsDeleteConfirmOpen(false);
//     setSelectedLead(null);
//   };

//   const isLoading = status === "loading";

//   return (
//     <>
//       <Card>
//         <CardHeader><div className="flex items-start justify-between gap-4"><div><CardTitle>Leads</CardTitle><CardDescription>Manage all potential customers in your system.</CardDescription></div><Button size="sm" className="h-9 gap-1 bg-red-600 text-white hover:bg-red-700" onClick={handleAddLead}><PlusCircle className="h-4 w-4" /><span className="hidden sm:inline">Add Lead</span></Button></div></CardHeader>
//         <CardContent><LeadTable leads={leads} onView={handleViewLead} onEdit={handleEditLead} onDelete={handleDeleteLead} isLoading={isLoading}/></CardContent>
//         <CardFooter className="flex items-center justify-between"><div className="text-xs text-muted-foreground">Showing <strong>{leads.length > 0 ? (currentPage - 1) * 10 + 1 : 0}-{(currentPage - 1) * 10 + leads.length}</strong> of <strong>{totalLeads}</strong> leads</div>
//           <Pagination><PaginationContent>
//               <PaginationItem><PaginationPrevious href="#" onClick={() => handlePageChange("prev")} className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""} /></PaginationItem>
//               <PaginationItem><PaginationNext href="#" onClick={() => handlePageChange("next")} className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""} /></PaginationItem>
//           </PaginationContent></Pagination>
//         </CardFooter>
//       </Card>
//       <LeadViewDialog isOpen={isViewOpen} onOpenChange={setIsViewOpen} lead={selectedLead} />
//       <LeadFormDialog isOpen={isFormOpen} onOpenChange={setIsFormOpen} lead={selectedLead} />
//       <DeleteConfirmationDialog isOpen={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen} onConfirm={confirmDelete} userName={selectedLead?.name || ""} />
//     </>
//   );
// }