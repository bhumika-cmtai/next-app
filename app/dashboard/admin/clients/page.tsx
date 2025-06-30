"use client";

import React, { useState, ChangeEvent, useEffect, FormEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Mail, Phone } from "lucide-react";
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
  deleteClient as deleteClientAction,
  setCurrentPage
} from "@/lib/redux/clientSlice";
import { AppDispatch } from "@/lib/store";
import { useSelector, useDispatch } from "react-redux";

export default function Clients() {
  const dispatch = useDispatch<AppDispatch>();
  const clients = useSelector(selectClients);
  const loading = useSelector(selectLoading);
  const pagination = useSelector(selectPagination);
  const currentPage = useSelector(selectCurrentPage);

  // --- MODIFIED: State simplified for generic search ---
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [deleteClient, setDeleteClient] = useState<Client | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // The form state should still match the full Client interface for adding/editing
  const [form, setForm] = useState<Omit<Client, "_id" | "createdOn" | "updatedOn" | "leaderCode">>({
    name: "",
    email: "",
    phoneNumber: "",
    status: "New",
    ownerName: [],
    city: "",
    age: 0,
    portalName: "",
    reason: ""
  });
  
  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // 500ms delay
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch clients when debounced search, filters, or page change
  useEffect(() => {
    // --- MODIFIED: API call uses the generic 'search' parameter ---
    // The backend will treat this as a name/email search
    dispatch(fetchClients({ search: debouncedSearch, status: statusFilter === 'all' ? undefined : statusFilter, page: currentPage }));
  }, [dispatch, debouncedSearch, statusFilter, currentPage]);

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

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= pagination.totalPages && page !== currentPage) {
      dispatch(setCurrentPage(page));
    }
  };

  const openAddModal = () => {
    setEditClient(null);
    setForm({
        name: "", email: "", phoneNumber: "", status: "New", ownerName: [], city: "", age: 0, portalName: "", reason: ""
    });
    setModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setEditClient(client);
    setForm({
      name: client.name,
      email: client.email,
      phoneNumber: client.phoneNumber,
      status: client.status,
      ownerName: client.ownerName,
      city: client.city,
      age: client.age,
      portalName: client.portalName,
      reason: client.reason || ""
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    let response;
    if (editClient && editClient._id) {
      response = await dispatch(updateClient(editClient._id, { ...editClient, ...form }));
    } else {
      // The form now includes all necessary fields for adding a client
      response = await dispatch(addClient(form as Client));
    }
    setFormLoading(false);

    if (response) {
      setModalOpen(false);
      // Refetch to see the changes
      dispatch(fetchClients({ search: debouncedSearch, status: statusFilter, page: currentPage }));
    }
  };

  const handleDelete = async () => {
    if (!deleteClient || !deleteClient._id) return;
    setDeleteLoading(true);
    const response = await dispatch(deleteClientAction(deleteClient._id));
    setDeleteLoading(false);

    if (response) {
      setDeleteClient(null); 
      const newPage = clients.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      dispatch(fetchClients({ search: debouncedSearch, status: statusFilter, page: newPage }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-blue-500";
      case "Contacted": return "bg-yellow-500";
      case "Interested": return "bg-green-500";
      case "Not Interested": return "bg-red-500";
      case "Converted": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="w-full mx-auto mt-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Registered List</h1>
        {/* --- MODIFIED: UI reverted to a single search input --- */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search by client name..."
            value={search}
            onChange={handleSearchChange}
            className="w-full sm:w-48"
          />
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Contacted">Contacted</SelectItem>
              <SelectItem value="Interested">Interested</SelectItem>
              <SelectItem value="Not Interested">Not Interested</SelectItem>
              <SelectItem value="Converted">Converted</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="default" size="sm" className="gap-1" onClick={openAddModal}>
            <Plus className="w-4 h-4" /> Add Client
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {/* Added # column back */}
                  <TableHead className="w-12">S.no.</TableHead>
                  <TableHead>Registered Client Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>LeaderCode</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8">Loading...</TableCell></TableRow>
                ) : clients.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8">No clients found.</TableCell></TableRow>
                ) : (
                  clients.map((client, idx) => (
                    <TableRow key={client._id}>
                      {/* Using pagination to calculate the index */}
                      <TableCell>{(pagination.currentPage - 1) * 8 + idx + 1}</TableCell>
                      <TableCell><div className="font-medium">{client.name}</div></TableCell>
                      <TableCell>
                          <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-500" /><span className="text-sm">{client.phoneNumber}</span></div>
                      </TableCell>
                      <TableCell><Badge className={`${getStatusColor(client.status)} text-white`}>{client.status}</Badge></TableCell>
                      <TableCell>{client.leaderCode}</TableCell>
                      <TableCell>{client.createdOn ? new Date(parseInt(client.createdOn)).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost" onClick={() => openEditModal(client)}><Edit className="w-4 h-4" /></Button>
                          <Button size="icon" variant="ghost" className="text-red-500" onClick={() => setDeleteClient(client)}><Trash2 className="w-4 h-4" /></Button>
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

      {/* Add/Edit Client Dialog */}
      <Dialog open={modalOpen} onOpenChange={(open) => { if (!open) { setModalOpen(false); setEditClient(null); }}}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader><DialogTitle>{editClient ? 'Edit Client' : 'Add Client'}</DialogTitle></DialogHeader>
          {/* Using a grid for better layout in the modal */}
          <form onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-4 py-4">
            <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="col-span-2 sm:col-span-1" />
            <Input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="col-span-2 sm:col-span-1" />
            <Input placeholder="Phone Number" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} required className="col-span-2 sm:col-span-1" />
            <Input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="col-span-2 sm:col-span-1" />
            {/* <Input placeholder="Owner Name" value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} className="col-span-2 sm:col-span-1" /> */}
            <Input placeholder="Portal Name" value={form.portalName} onChange={(e) => setForm({ ...form, portalName: e.target.value })} className="col-span-2 sm:col-span-1" />
            <Input type="number" placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: Number(e.target.value) || 0 })} className="col-span-2" />
            <Select value={form.status} onValueChange={(value: string) => setForm({ ...form, status: value })} >
                <SelectTrigger className="col-span-2">
                    <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Contacted">Contacted</SelectItem>
                    <SelectItem value="Interested">Interested</SelectItem>
                    <SelectItem value="Not Interested">Not Interested</SelectItem>
                    <SelectItem value="Converted">Converted</SelectItem>
                </SelectContent>
            </Select>
            {form.status === "Not Interested" && (
                 <Input placeholder="Reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="col-span-2" />
            )}
            <DialogFooter className="col-span-2">
              <DialogClose asChild><Button type="button" variant="outline" disabled={formLoading}>Cancel</Button></DialogClose>
              <Button type="submit" disabled={formLoading}>{formLoading ? 'Saving...' : (editClient ? 'Update Client' : 'Add Client')}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteClient} onOpenChange={(open) => !open && setDeleteClient(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Client</DialogTitle><DialogDescription>Are you sure you want to delete the client for <b>{deleteClient?.name}</b>? This action cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>{deleteLoading ? 'Deleting...' : 'Delete'}</Button>
            <DialogClose asChild><Button type="button" variant="outline" disabled={deleteLoading}>Cancel</Button></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem><PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} /></PaginationItem>
              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink href="#" isActive={currentPage === i + 1} onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }}>
                    {i + 1}
                  </PaginationLink>
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