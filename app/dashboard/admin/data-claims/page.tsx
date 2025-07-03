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
// **** MODIFIED: Removed Trash2, kept Edit and Phone ****
import { Plus, Edit, Phone, Trash2 } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";

import { 
  fetchClients, 
  selectClients, 
  selectLoading, 
  selectPagination, 
  selectCurrentPage, 
  Client, 
  addClient, 
  updateClient, 
  // **** MODIFIED: No longer importing deleteClientAction ****
  setCurrentPage,
  fetchPortalNames,
  selectPortalNames,
distributeCommissionForClient 
} from "@/lib/redux/clientSlice";
import { AppDispatch } from "@/lib/store";
import { useSelector, useDispatch } from "react-redux";

export default function Clients() {
  const dispatch = useDispatch<AppDispatch>();
  
  // Selectors from Redux store
  const clients = useSelector(selectClients);
  const loading = useSelector(selectLoading);
  const pagination = useSelector(selectPagination);
  const currentPage = useSelector(selectCurrentPage);
  const portalNames = useSelector(selectPortalNames);

  // Component State
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [portalFilter, setPortalFilter] = useState("all");
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  // **** NEW: State to manage per-button loading and success ****
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [approvedClients, setApprovedClients] = useState<string[]>([]);

  
  // **** MODIFIED: Removed deleteClient state ****
  // const [deleteClient, setDeleteClient] = useState<Client | null>(null);

  const [formLoading, setFormLoading] = useState(false);
  // **** MODIFIED: Removed deleteLoading state ****
  // const [deleteLoading, setDeleteLoading] = useState(false);

  const [form, setForm] = useState<Omit<Client, "_id" | "createdOn" | "updatedOn" | "leaderCode">>({
    name: "",
    email: "",
    phoneNumber: "",
    status: "New",
    ownerName: [],
    ownerNumber: [],
    city: "",
    age: 0,
    portalName: "",
    reason: "",
    ekyc_stage: 'notComplete',
    trade_status: 'notMatched',
  });
  
  // Fetch portal names on component mount
  useEffect(() => {
    dispatch(fetchPortalNames());
  }, [dispatch]);

  // Debounce search input to avoid excessive API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Main effect to fetch clients when any filter or page changes
  useEffect(() => {
    dispatch(fetchClients({ 
      searchQuery: debouncedSearch, 
      status: statusFilter, 
      portalName: portalFilter,
      page: currentPage 
    }));
  }, [dispatch, debouncedSearch, statusFilter, portalFilter, currentPage]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (currentPage !== 1) {
        dispatch(setCurrentPage(1));
    }
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    if (currentPage !== 1) {
        dispatch(setCurrentPage(1));
    }
  };

  const handlePortalChange = (value: string) => {
    setPortalFilter(value);
    if (currentPage !== 1) {
      dispatch(setCurrentPage(1));
    }
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= pagination.totalPages && page !== currentPage) {
      dispatch(setCurrentPage(page));
    }
  };

  const openAddModal = () => {
    setEditClient(null);
    setForm({
      name: "", email: "", phoneNumber: "", status: "New", ownerName: [], ownerNumber: [], city: "", age: 0, portalName: "", reason: "", ekyc_stage: 'notComplete', trade_status: 'notMatched'
    });
    setModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setEditClient(client);
    setForm({
      name: client.name || "",
      email: client.email || "",
      phoneNumber: client.phoneNumber || "",
      status: client.status || "New",
      ownerName: client.ownerName || [],
      ownerNumber: client.ownerNumber || [],
      city: client.city || "",
      age: client.age || 0,
      portalName: client.portalName || "",
      reason: client.reason || "",
      ekyc_stage: client.ekyc_stage || "notComplete",
      trade_status: client.trade_status || 'notMatched'
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    let response;
    if (editClient && editClient._id) {
      response = await dispatch(updateClient(editClient._id, form));
    } else {
      response = await dispatch(addClient(form as Client));
    }
    setFormLoading(false);

    if (response) {
      setModalOpen(false);
      dispatch(fetchClients({ searchQuery: debouncedSearch, status: statusFilter, portalName: portalFilter, page: currentPage }));
    }
  };

  const handleRemoveOwner = (indexToRemove: number) => {
    const newOwnerNames = (form.ownerName ?? []).filter((_, index) => index !== indexToRemove);
    const newOwnerNumbers = (form.ownerNumber ?? []).filter((_, index) => index !== indexToRemove);

    setForm({
      ...form,
      ownerName: newOwnerNames,
      ownerNumber: newOwnerNumbers,
    });
  };

  // **** NEW: Placeholder function for approving payment ****
  const handleApprovePayment = async (client: Client) => {
    if (!client._id || !client.portalName) return;

    setApprovingId(client._id); // Set loading state for this specific button
    try {
      const result = await dispatch(distributeCommissionForClient({ 
        clientId: client._id, 
        portalName: client.portalName 
      }));
      
      if (result) {
        // Mark this client as approved to change the button state permanently
        setApprovedClients(prev => [...prev, client._id!]);
      }
    } finally {
      setApprovingId(null); // Clear loading state regardless of outcome
    }
  };

  // **** MODIFIED: Removed the handleDelete function ****

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      'New': 'bg-blue-500',
      'RegisterationDone': 'bg-teal-500',
      'CallCut': 'bg-yellow-500',
      'CallNotPickUp': 'bg-orange-500',
      'NotInterested': 'bg-red-500',
      'InvalidNumber': 'bg-gray-500',
    };
    return statusColors[status] || "bg-gray-400";
  };

  return (
    <div className="w-full mx-auto mt-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Data Claims</h1>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Input placeholder="Search by client name..." value={search} onChange={handleSearchChange} className="w-full sm:w-48"/>
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="RegisterationDone">Registered</SelectItem>
              <SelectItem value="CallCut">Call Cut</SelectItem>
              <SelectItem value="CallNotPickUp">Not Picked Up</SelectItem>
              <SelectItem value="NotInterested">Not Interested</SelectItem>
              <SelectItem value="InvalidNumber">Invalid Number</SelectItem>
            </SelectContent>
          </Select>
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
                  <TableHead>KYC Status</TableHead>
                  <TableHead>Trade Status</TableHead>
                  <TableHead>Owner Names</TableHead>
                  <TableHead>Owner Numbers</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={10} className="text-center py-8">Loading...</TableCell></TableRow>
                ) : clients.length === 0 ? (
                  <TableRow><TableCell colSpan={10} className="text-center py-8">No clients found.</TableCell></TableRow>
                ) : (
                  clients.map((client, idx) => (
                    <TableRow key={client._id}>
                      <TableCell>{(pagination.currentPage - 1) * 8 + idx + 1}</TableCell>
                      <TableCell>{client.portalName || "-"}</TableCell>
                      <TableCell><div className="font-medium">{client.name}</div></TableCell>
                      <TableCell><div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-500" /><span className="text-sm">{client.phoneNumber}</span></div></TableCell>
                      <TableCell>{client.ekyc_stage === "notComplete" ? "Not Complete" : "Complete"}</TableCell>
                      <TableCell>{client.trade_status === "notMatched" ? "Not Matched" : "Matched"}</TableCell>
                      <TableCell>{client.ownerName?.join(', ') || '-'}</TableCell>
                      <TableCell>{client.ownerNumber?.join(', ') || '-'}</TableCell>
                      <TableCell>{client.createdOn ? new Date(parseInt(client.createdOn)).toLocaleDateString() : '-'}</TableCell>
                      
                      {/* **** MODIFIED: Actions Cell now has "Edit" and "Approve Payment" buttons **** */}
                      <TableCell>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEditModal(client)}>
                            <Edit className="h-3 w-3 mr-2" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 text-white hover:bg-green-700"
                            onClick={() => handleApprovePayment(client)}
                          >
                            Approve 
                          </Button>
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

      <Dialog open={modalOpen} onOpenChange={(open) => { if (!open) { setModalOpen(false); setEditClient(null); }}}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editClient ? 'Edit Client' : 'Add Client'}</DialogTitle></DialogHeader>
          <form onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-x-4 gap-y-6 py-4">
            
            {editClient && (
              <div className="col-span-2 space-y-2">
                <Label>Manage Owners</Label>
                <div className="border rounded-md p-2 space-y-2 max-h-32 overflow-y-auto">
                  {form.ownerName && form.ownerName.length > 0 ? (
                    form.ownerName.map((name, index) => (
                      <div key={index} className="flex items-center justify-between text-sm p-1 rounded-md bg-muted/50">
                        <span>{name} - {(form.ownerNumber?.[index] ?? "")}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-500"
                          onClick={() => handleRemoveOwner(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-2">No owners assigned.</p>
                  )}
                </div>
              </div>
            )}
            
            <div className="col-span-2 sm:col-span-1 space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Client's full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>

            <div className="col-span-2 sm:col-span-1 space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="client@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>

            <div className="col-span-2 sm:col-span-1 space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" placeholder="10-digit number" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} required />
            </div>

            <div className="col-span-2 sm:col-span-1 space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="Client's city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>

            <div className="col-span-2 sm:col-span-1 space-y-2">
              <Label htmlFor="portalName">Portal Name</Label>
              <Input id="portalName" placeholder="e.g., Angel-One" value={form.portalName} onChange={(e) => setForm({ ...form, portalName: e.target.value })} />
            </div>

            <div className="col-span-2 sm:col-span-1 space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" placeholder="Client's age" value={form.age || ''} onChange={(e) => setForm({ ...form, age: Number(e.target.value) || 0 })} />
            </div>
            
            <div className="col-span-2 sm:col-span-1 space-y-2">
              <Label htmlFor="ekyc_stage">KYC Status</Label>
              <Select value={form.ekyc_stage} onValueChange={(value) => setForm({ ...form, ekyc_stage: value })}>
                <SelectTrigger id="ekyc_stage"><SelectValue placeholder="Select KYC Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="notComplete">Not Complete</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 sm:col-span-1 space-y-2">
              <Label htmlFor="trade_status">Trade Status</Label>
              <Select value={form.trade_status} onValueChange={(value) => setForm({ ...form, trade_status: value })}>
                <SelectTrigger id="trade_status"><SelectValue placeholder="Select Trade Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="notMatched">Not Matched</SelectItem>
                  <SelectItem value="matched">Matched</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-2 space-y-2">
              <Label htmlFor="status">Client Status</Label>
              <Select value={form.status} onValueChange={(value: string) => setForm({ ...form, status: value })} >
                  <SelectTrigger id="status"><SelectValue placeholder="Select Status" /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="RegisterationDone">Registered</SelectItem>
                      <SelectItem value="CallCut">Call Cut</SelectItem>
                      <SelectItem value="CallNotPickUp">Not Picked Up</SelectItem>
                      <SelectItem value="NotInterested">Not Interested</SelectItem>
                      <SelectItem value="InvalidNumber">Invalid Number</SelectItem>
                  </SelectContent>
              </Select>
            </div>
            
            {form.status === "NotInterested" && (
                 <div className="col-span-2 space-y-2">
                  <Label htmlFor="reason">Reason for Not Interested</Label>
                  <Input id="reason" placeholder="Enter reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
                 </div>
            )}
            
            <DialogFooter className="col-span-2 pt-4">
              <DialogClose asChild><Button type="button" variant="outline" disabled={formLoading}>Cancel</Button></DialogClose>
              <Button type="submit" disabled={formLoading}>{formLoading ? 'Saving...' : (editClient ? 'Update Client' : 'Add Client')}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* **** MODIFIED: Removed the delete dialog **** */}

      {pagination.totalPages > 1 && !loading && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem><PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} /></PaginationItem>
              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink href="#" isActive={currentPage === i + 1} onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }}>{i + 1}</PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem><PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} /></PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}