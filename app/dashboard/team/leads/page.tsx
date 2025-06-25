// // change start
// "use client";

// import React, { useState, ChangeEvent, useEffect, FormEvent } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
// import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { Plus, Upload, Edit, Trash2, Mail, Phone, Download } from "lucide-react";
// import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
// import { fetchLeads, selectLeads, selectLoading, selectPagination, selectCurrentPage, Lead, addLead, updateLead, deleteLead as deleteLeadAction } from "@/lib/redux/leadSlice";
// import { AppDispatch } from "@/lib/store";
// import { useSelector, useDispatch } from "react-redux";


// export default function Leads() {
//   const dispatch = useDispatch<AppDispatch>();
//   const leads = useSelector(selectLeads);
//   const loading = useSelector(selectLoading);
//   const pagination = useSelector(selectPagination);
//   const currentPage = useSelector(selectCurrentPage);

//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [modalOpen, setModalOpen] = useState(false);
//   const [importModalOpen, setImportModalOpen] = useState(false);
//   const [editLead, setEditLead] = useState<Lead | null>(null);
//   const [deleteLead, setDeleteLead] = useState<Lead | null>(null);
//   const [formLoading, setFormLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [exportModalOpen, setExportModalOpen] = useState(false);
//   const [exportStatus, setExportStatus] = useState("all");

//   const [form, setForm] = useState<Omit<Lead, "_id" | "createdOn" | "updatedOn">>({
//     name: "",
//     email: "",
//     phoneNumber: "",
//     qualification: "",
//     city: "",
//     date_of_birth: "",
//     gender: "",
//     message: "",
//     status: "New",
//     source: "",
//   });

//   // Debounce search input
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearch(search);
//     }, 500);
//     return () => clearTimeout(handler);
//   }, [search]);

//   // Fetch leads when filters or page change
//   useEffect(() => {
//     dispatch(fetchLeads({ search: debouncedSearch, status: statusFilter === 'all' ? undefined : statusFilter, page: currentPage }));
//   }, [dispatch, debouncedSearch, statusFilter, currentPage]);

//   const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setSearch(e.target.value);
//   };

//   const handleStatusChange = (value: string) => {
//     setStatusFilter(value);
//     // When filter changes, go back to page 1
//     dispatch(fetchLeads({ search: debouncedSearch, status: value === 'all' ? undefined : value, page: 1 }));
//   };

//   const handlePageChange = (page: number) => {
//     if (page > 0 && page <= pagination.totalPages) {
//       dispatch(fetchLeads({ search: debouncedSearch, status: statusFilter === 'all' ? undefined : statusFilter, page }));
//     }
//   };

//   const openAddModal = () => {
//     setEditLead(null);
//     setForm({ name: "", email: "", phoneNumber: "", qualification: "", city: "", date_of_birth: "", gender: "", message: "", status: "New", source: "" });
//     setModalOpen(true);
//   };

//   const openEditModal = (lead: Lead) => {
//     setEditLead(lead);
//     setForm({
//       name: lead.name,
//       email: lead.email,
//       phoneNumber: lead.phoneNumber,
//       qualification: lead.qualification,
//       city: lead.city,
//       date_of_birth: lead.date_of_birth,
//       gender: lead.gender,
//       message: lead.message,
//       status: lead.status,
//       source: lead.source,
//     });
//     setModalOpen(true);
//   };

//   const handleFormSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setFormLoading(true);
//     let response;
//     if (editLead && editLead._id) {
//       response = await dispatch(updateLead(editLead._id, { ...editLead, ...form }));
//     } else {
//       response = await dispatch(addLead(form as Lead));
//     }
//     setFormLoading(false);

//     if (response) {
//       setModalOpen(false);
//       dispatch(fetchLeads({ search: debouncedSearch, status: statusFilter === 'all' ? undefined : statusFilter, page: currentPage }));
//     }
//   };

//   const handleDelete = async () => {
//     if (!deleteLead || !deleteLead._id) return;
//     setDeleteLoading(true);
//     const response = await dispatch(deleteLeadAction(deleteLead._id));
//     setDeleteLoading(false);

//     if (response) {
//       setDeleteLead(null); // Close confirmation dialog
//       // If the last item on a page is deleted, fetch the previous page
//       const newPage = leads.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
//       dispatch(fetchLeads({ search: debouncedSearch, status: statusFilter === 'all' ? undefined : statusFilter, page: newPage }));
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "New": return "bg-blue-500";
//       case "Contacted": return "bg-yellow-500";
//       case "Interested": return "bg-green-500";
//       case "Not Interested": return "bg-red-500";
//       case "Converted": return "bg-purple-500";
//       default: return "bg-gray-500";
//     }
//   };

//   const handleImportSuccess = () => {
//     setImportModalOpen(false);
//     dispatch(fetchLeads({ page: 1 }));
//   };

//   const handleExport = () => {
//     // Filter leads by selected status
//     const filteredLeads = exportStatus === "all" 
//       ? leads 
//       : leads.filter(lead => lead.status === exportStatus);
    
//     // Convert to CSV format
//     const headers = ["Name", "Email", "Phone", "Status", "Source", "Message", "Created"];
//     const csvContent = [
//       headers.join(","),
//       ...filteredLeads.map(lead => [
//         lead.name,
//         lead.email,
//         lead.phoneNumber,
//         lead.status,
//         lead.source,
//         lead.message?.replace(/,/g, " ") || "",
//         lead.createdOn ? new Date(parseInt(lead.createdOn)).toLocaleDateString() : ""
//       ].join(","))
//     ].join("\n");
    
//     // Create download link
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.setAttribute("href", url);
//     link.setAttribute("download", `leads-${exportStatus.toLowerCase()}-${new Date().toISOString().split("T")[0]}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
    
//     setExportModalOpen(false);
//   };

//   return (
//     <div className="w-full mx-auto mt-2">
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
//         <h1 className="text-3xl font-bold">Leads List</h1>
//         <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
//           <Input
//             placeholder="Search leads..."
//             value={search}
//             onChange={handleSearchChange}
//             className="w-full sm:w-48"
//           />
//           <Select value={statusFilter} onValueChange={handleStatusChange}>
//             <SelectTrigger className="w-full sm:w-40">
//               <SelectValue placeholder="All Status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Status</SelectItem>
//               <SelectItem value="New">New</SelectItem>
//               <SelectItem value="Contacted">Contacted</SelectItem>
//               <SelectItem value="Interested">Interested</SelectItem>
//               <SelectItem value="Not Interested">Not Interested</SelectItem>
//               <SelectItem value="Converted">Converted</SelectItem>
//             </SelectContent>
//           </Select>

//           <Button variant="outline" size="sm" className="gap-1" onClick={() => setExportModalOpen(true)}>
//             <Download className="w-4 h-4" /> Export
//           </Button>
//         </div>
//       </div>

//       <Card>
//         <CardContent className="p-0">
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="w-12">#</TableHead>
//                   <TableHead>Lead</TableHead>
//                   <TableHead>Contact</TableHead>
//                   <TableHead>Source</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Notes</TableHead>
//                   <TableHead>Created</TableHead>
//                   <TableHead>Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {loading && leads.length === 0 ? (
//                   <TableRow><TableCell colSpan={8} className="text-center py-8">Loading...</TableCell></TableRow>
//                 ) : leads.length === 0 ? (
//                   <TableRow><TableCell colSpan={8} className="text-center py-8">No leads found.</TableCell></TableRow>
//                 ) : (
//                   leads.map((lead, idx) => (
//                     <TableRow key={lead._id}>
//                       <TableCell>{(currentPage - 1) * 20 + idx + 1}</TableCell>
//                       <TableCell><div className="font-medium">{lead.name}</div></TableCell>
//                       <TableCell>
//                         <div className="flex flex-col gap-1">
//                           <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-500" /><span className="text-sm">{lead.email}</span></div>
//                           <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-500" /><span className="text-sm">{lead.phoneNumber}</span></div>
//                         </div>
//                       </TableCell>
//                       <TableCell>{lead.source}</TableCell>
//                       <TableCell><Badge className={`${getStatusColor(lead.status)} text-white`}>{lead.status}</Badge></TableCell>
//                       <TableCell><div className="max-w-[200px] truncate text-sm text-gray-600">{lead.message || '-'}</div></TableCell>
//                       <TableCell>{lead.createdOn ? new Date(parseInt(lead.createdOn)).toLocaleDateString() : '-'}</TableCell>
//                       <TableCell>
//                         <div className="flex gap-2">
//                           <Button size="icon" variant="ghost" onClick={() => openEditModal(lead)}><Edit className="w-4 h-4" /></Button>
//                           <Button size="icon" variant="ghost" className="text-red-500" onClick={() => setDeleteLead(lead)}><Trash2 className="w-4 h-4" /></Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Add/Edit Lead Dialog */}
//       <Dialog open={modalOpen} onOpenChange={(open) => { if (!open) { setModalOpen(false); setEditLead(null); }}}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>{editLead ? 'Edit Lead' : 'Add Lead'}</DialogTitle></DialogHeader>
//           <form onSubmit={handleFormSubmit} className="space-y-4 mt-2">
//             <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
//             <Input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
//             <Input placeholder="phoneNumber" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} required />
//             <Select value={form.source} onValueChange={(value: string) => setForm({ ...form, source: value })}><SelectTrigger><SelectValue placeholder="Select Source" /></SelectTrigger><SelectContent><SelectItem value="Website">Website</SelectItem><SelectItem value="Social Media">Social Media</SelectItem><SelectItem value="Referral">Referral</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select>
//             <Select value={form.status} onValueChange={(value: string) => setForm({ ...form, status: value })}><SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger><SelectContent><SelectItem value="New">New</SelectItem><SelectItem value="Contacted">Contacted</SelectItem><SelectItem value="Interested">Interested</SelectItem><SelectItem value="Not Interested">Not Interested</SelectItem><SelectItem value="Converted">Converted</SelectItem></SelectContent></Select>
//             <textarea className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background" placeholder="Notes" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
//             <DialogFooter>
//               <Button type="submit" disabled={formLoading}>{formLoading ? 'Saving...' : (editLead ? 'Update Lead' : 'Add Lead')}</Button>
//               <DialogClose asChild><Button type="button" variant="outline" disabled={formLoading}>Cancel</Button></DialogClose>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
      
//       {/* Delete Confirmation Dialog */}
//       <Dialog open={!!deleteLead} onOpenChange={(open) => !open && setDeleteLead(null)}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>Delete Lead</DialogTitle><DialogDescription>Are you sure you want to delete the lead for <b>{deleteLead?.name}</b>? This action cannot be undone.</DialogDescription></DialogHeader>
//           <DialogFooter>
//             <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>{deleteLoading ? 'Deleting...' : 'Delete'}</Button>
//             <DialogClose asChild><Button type="button" variant="outline" disabled={deleteLoading}>Cancel</Button></DialogClose>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Import Leads Dialog */}
//       {/* <ImportLeads open={importModalOpen} onOpenChange={setImportModalOpen} onImportSuccess={handleImportSuccess} /> */}

//       {/* Export Leads Dialog */}
//       <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Export Leads</DialogTitle>
//             <DialogDescription>
//               Choose a status to filter leads for export
//             </DialogDescription>
//           </DialogHeader>
//           <div className="py-4">
//             <Select value={exportStatus} onValueChange={setExportStatus}>
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Select Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Status</SelectItem>
//                 <SelectItem value="New">New</SelectItem>
//                 <SelectItem value="Contacted">Contacted</SelectItem>
//                 <SelectItem value="Interested">Interested</SelectItem>
//                 <SelectItem value="Not Interested">Not Interested</SelectItem>
//                 <SelectItem value="Converted">Converted</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <DialogFooter>
//             <Button onClick={handleExport}>Export CSV</Button>
//             <Button variant="outline" onClick={() => setExportModalOpen(false)}>Cancel</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Pagination */}
//       {pagination.totalPages > 1 && (
//         <div className="mt-4">
//           <Pagination>
//             <PaginationContent>
//               <PaginationItem><PaginationPrevious href="#" onClick={() => handlePageChange(currentPage - 1)} /></PaginationItem>
//               {Array.from({ length: pagination.totalPages }, (_, i) => (
//                 <PaginationItem key={i + 1}>
//                   <PaginationLink href="#" isActive={currentPage === i + 1} onClick={() => handlePageChange(i + 1)}>
//                     {i + 1}
//                   </PaginationLink>
//                 </PaginationItem>
//               ))}
//               <PaginationItem><PaginationNext href="#" onClick={() => handlePageChange(currentPage + 1)} /></PaginationItem>
//             </PaginationContent>
//           </Pagination>
//         </div>
//       )}
//     </div>
//   );
// }