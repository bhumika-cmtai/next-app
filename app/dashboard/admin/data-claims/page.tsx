"use client";

import React, { useState, ChangeEvent, useEffect, FormEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Phone, CheckCircle } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // **** NEW: Import Tooltip ****

import { 
  fetchClients, 
  selectClients, 
  selectLoading, 
  selectPagination, 
  selectCurrentPage, 
  Client, 
  addClient, 
  updateClient, 
  deleteClient as deleteClientAction,
  setCurrentPage,
  fetchPortalNames,
  selectPortalNames
} from "@/lib/redux/clientSlice";
import { AppDispatch } from "@/lib/store";
import { useSelector, useDispatch } from "react-redux";

export default function Clients() {
  const dispatch = useDispatch<AppDispatch>();
  
  // ... (all your existing state and functions remain the same)
  const clients = useSelector(selectClients);
  const loading = useSelector(selectLoading);
  const pagination = useSelector(selectPagination);
  const currentPage = useSelector(selectCurrentPage);
  const portalNames = useSelector(selectPortalNames);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [portalFilter, setPortalFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [deleteClient, setDeleteClient] = useState<Client | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [form, setForm] = useState<Omit<Client, "_id" | "createdOn" | "updatedOn" | "leaderCode">>({ name: "", email: "", phoneNumber: "", status: "New", ownerName: [], ownerNumber: [], city: "", age: 0, portalName: "", reason: "", ekyc_stage: 'notComplete', trade_status: 'notMatched' });
  
  useEffect(() => { dispatch(fetchPortalNames()); }, [dispatch]);
  useEffect(() => { const handler = setTimeout(() => { setDebouncedSearch(search); }, 500); return () => clearTimeout(handler); }, [search]);
  useEffect(() => { dispatch(fetchClients({ searchQuery: debouncedSearch, status: statusFilter, portalName: portalFilter, page: currentPage })); }, [dispatch, debouncedSearch, statusFilter, portalFilter, currentPage]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => { setSearch(e.target.value); if (currentPage !== 1) { dispatch(setCurrentPage(1)); } };
  const handleStatusChange = (value: string) => { setStatusFilter(value); if (currentPage !== 1) { dispatch(setCurrentPage(1)); } };
  const handlePortalChange = (value: string) => { setPortalFilter(value); if (currentPage !== 1) { dispatch(setCurrentPage(1)); } };
  const handlePageChange = (page: number) => { if (page > 0 && page <= pagination.totalPages && page !== currentPage) { dispatch(setCurrentPage(page)); } };
  const handleApproveOwner = (clientName: string, ownerName: string) => { alert(`Approving owner "${ownerName}" for client "${clientName}".`); };
  const openAddModal = () => { setEditClient(null); setForm({ name: "", email: "", phoneNumber: "", status: "New", ownerName: [], ownerNumber: [], city: "", age: 0, portalName: "", reason: "", ekyc_stage: 'notComplete', trade_status: 'notMatched' }); setModalOpen(true); };
  const openEditModal = (client: Client) => { setEditClient(client); setForm({ name: client.name || "", email: client.email || "", phoneNumber: client.phoneNumber || "", status: client.status || "New", ownerName: client.ownerName || [], ownerNumber: client.ownerNumber || [], city: client.city || "", age: client.age || 0, portalName: client.portalName || "", reason: client.reason || "", ekyc_stage: client.ekyc_stage || "notComplete", trade_status: client.trade_status || 'notMatched' }); setModalOpen(true); };
  const handleFormSubmit = async (e: FormEvent) => { e.preventDefault(); setFormLoading(true); let response; if (editClient && editClient._id) { response = await dispatch(updateClient(editClient._id, form)); } else { response = await dispatch(addClient(form as Client)); } setFormLoading(false); if (response) { setModalOpen(false); dispatch(fetchClients({ searchQuery: debouncedSearch, status: statusFilter, portalName: portalFilter, page: currentPage })); } };
  const handleDelete = async () => { if (!deleteClient || !deleteClient._id) return; setDeleteLoading(true); const response = await dispatch(deleteClientAction(deleteClient._id)); setDeleteLoading(false); if (response) { setDeleteClient(null); const newPage = clients.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage; dispatch(fetchClients({ searchQuery: debouncedSearch, status: statusFilter, portalName: portalFilter, page: newPage })); } };


  return (
    <div className="w-full mx-auto mt-2">
      {/* Filters and Header section remains the same */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Data Claims</h1>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Input placeholder="Search by client name..." value={search} onChange={handleSearchChange} className="w-full sm:w-48"/>
          <Select value={portalFilter} onValueChange={handlePortalChange}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All Portals" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Portals</SelectItem>
              {portalNames.map((name) => (<SelectItem key={name} value={name}>{name}</SelectItem>))}
            </SelectContent>
          </Select>
          <Button variant="default" size="sm" className="gap-1" onClick={openAddModal}><Plus className="w-4 h-4" /> Add Client</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">S.no.</TableHead>
                  <TableHead>Portal</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>KYC</TableHead>
                  <TableHead>Trade</TableHead>
                  <TableHead className="min-w-[300px]">Owner Details</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={9} className="text-center py-8">Loading...</TableCell></TableRow>
                ) : clients.length === 0 ? (
                  <TableRow><TableCell colSpan={9} className="text-center py-8">No clients found.</TableCell></TableRow>
                ) : (
                  clients.map((client, idx) => (
                    <TableRow key={client._id} className="align-top">
                      <TableCell>{(pagination.currentPage - 1) * 8 + idx + 1}</TableCell>
                      <TableCell>{client.portalName || "-"}</TableCell>
                      <TableCell><div className="font-medium">{client.name}</div></TableCell>
                      <TableCell><div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-500" /><span className="text-sm">{client.phoneNumber}</span></div></TableCell>
                      <TableCell>{client.ekyc_stage === "notComplete" ? "Not Complete" : "Complete"}</TableCell>
                      <TableCell>{client.trade_status === "notMatched" ? "Not Matched" : "Matched"}</TableCell>
                      
                      {/* **** NEW & IMPROVED "CARD LIST" LAYOUT **** */}
                      <TableCell className="p-2">
                        {(client.ownerName && client.ownerName.length > 0) ? (
                          <div className="flex flex-col gap-2">
                            {client.ownerName.map((name, i) => (
                              <div key={i} className="flex items-center justify-between rounded-md border p-2 bg-muted/30">
                                <div>
                                  <p className="font-medium text-sm">{name}</p>
                                  <p className="text-xs text-muted-foreground">{client.ownerNumber?.[i] || 'N/A'}</p>
                                </div>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        size="icon" 
                                        variant="ghost" 
                                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100"
                                        onClick={() => handleApproveOwner(client.name, name)}
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Approve Owner</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>

                      <TableCell>{client.createdOn ? new Date(parseInt(client.createdOn)).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <TooltipProvider>
                              <Tooltip>
                                  <TooltipTrigger asChild>
                                      <Button size="icon" variant="ghost" onClick={() => openEditModal(client)}><Edit className="w-4 h-4" /></Button>
                                  </TooltipTrigger>
                                  <TooltipContent><p>Edit Client</p></TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                  <TooltipTrigger asChild>
                                      <Button size="icon" variant="ghost" className="text-red-500" onClick={() => setDeleteClient(client)}><Trash2 className="w-4 h-4" /></Button>
                                  </TooltipTrigger>
                                  <TooltipContent><p>Delete Client</p></TooltipContent>
                              </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* All Dialogs and Pagination remain unchanged */}
      <Dialog open={modalOpen} onOpenChange={(open) => { if (!open) { setModalOpen(false); setEditClient(null); }}}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader><DialogTitle>{editClient ? 'Edit Client' : 'Add Client'}</DialogTitle></DialogHeader>
          <form onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-x-4 gap-y-6 py-4">
            <div className="col-span-2 sm:col-span-1 space-y-2"><Label htmlFor="name">Name</Label><Input id="name" placeholder="Client's full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="col-span-2 sm:col-span-1 space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="client@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="col-span-2 sm:col-span-1 space-y-2"><Label htmlFor="phoneNumber">Phone Number</Label><Input id="phoneNumber" placeholder="10-digit number" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} required /></div>
            <div className="col-span-2 sm:col-span-1 space-y-2"><Label htmlFor="city">City</Label><Input id="city" placeholder="Client's city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
            <div className="col-span-2 sm:col-span-1 space-y-2"><Label htmlFor="portalName">Portal Name</Label><Input id="portalName" placeholder="e.g., Angel-One" value={form.portalName} onChange={(e) => setForm({ ...form, portalName: e.target.value })} /></div>
            <div className="col-span-2 sm:col-span-1 space-y-2"><Label htmlFor="age">Age</Label><Input id="age" type="number" placeholder="Client's age" value={form.age || ''} onChange={(e) => setForm({ ...form, age: Number(e.target.value) || 0 })} /></div>
            <div className="col-span-2 sm:col-span-1 space-y-2"><Label htmlFor="ekyc_stage">KYC Status</Label><Select value={form.ekyc_stage} onValueChange={(value) => setForm({ ...form, ekyc_stage: value })}><SelectTrigger id="ekyc_stage"><SelectValue placeholder="Select KYC Status" /></SelectTrigger><SelectContent><SelectItem value="notComplete">Not Complete</SelectItem><SelectItem value="complete">Complete</SelectItem></SelectContent></Select></div>
            <div className="col-span-2 sm:col-span-1 space-y-2"><Label htmlFor="trade_status">Trade Status</Label><Select value={form.trade_status} onValueChange={(value) => setForm({ ...form, trade_status: value })}><SelectTrigger id="trade_status"><SelectValue placeholder="Select Trade Status" /></SelectTrigger><SelectContent><SelectItem value="notMatched">Not Matched</SelectItem><SelectItem value="matched">Matched</SelectItem></SelectContent></Select></div>
            <div className="col-span-2 space-y-2"><Label htmlFor="status">Client Status</Label><Select value={form.status} onValueChange={(value: string) => setForm({ ...form, status: value })} ><SelectTrigger id="status"><SelectValue placeholder="Select Status" /></SelectTrigger><SelectContent><SelectItem value="New">New</SelectItem><SelectItem value="RegisterationDone">Registered</SelectItem><SelectItem value="CallCut">Call Cut</SelectItem><SelectItem value="CallNotPickUp">Not Picked Up</SelectItem><SelectItem value="NotInterested">Not Interested</SelectItem><SelectItem value="InvalidNumber">Invalid Number</SelectItem></SelectContent></Select></div>
            {form.status === "NotInterested" && ( <div className="col-span-2 space-y-2"><Label htmlFor="reason">Reason for Not Interested</Label><Input id="reason" placeholder="Enter reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></div> )}
            <DialogFooter className="col-span-2 pt-4"><DialogClose asChild><Button type="button" variant="outline" disabled={formLoading}>Cancel</Button></DialogClose><Button type="submit" disabled={formLoading}>{formLoading ? 'Saving...' : (editClient ? 'Update Client' : 'Add Client')}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={!!deleteClient} onOpenChange={(open) => !open && setDeleteClient(null)}><DialogContent><DialogHeader><DialogTitle>Delete Client</DialogTitle><DialogDescription>Are you sure you want to delete the client for <b>{deleteClient?.name}</b>? This action cannot be undone.</DialogDescription></DialogHeader><DialogFooter><Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>{deleteLoading ? 'Deleting...' : 'Delete'}</Button><DialogClose asChild><Button type="button" variant="outline" disabled={deleteLoading}>Cancel</Button></DialogClose></DialogFooter></DialogContent></Dialog>
      {pagination.totalPages > 1 && !loading && ( <div className="mt-4"><Pagination><PaginationContent><PaginationItem><PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} /></PaginationItem>{Array.from({ length: pagination.totalPages }, (_, i) => ( <PaginationItem key={i + 1}><PaginationLink href="#" isActive={currentPage === i + 1} onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }}>{i + 1}</PaginationLink></PaginationItem> ))}<PaginationItem><PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} /></PaginationItem></PaginationContent></Pagination></div> )}
    </div>
  );
}