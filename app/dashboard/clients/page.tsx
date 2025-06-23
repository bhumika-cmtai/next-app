// change start
"use client";

import React, { useState, ChangeEvent, useEffect, FormEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, Edit, Trash2, Mail, Phone } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { fetchClients, selectClients, selectLoading, selectPagination, selectCurrentPage, Client, addClient, updateClient, deleteClient as deleteClientAction } from "@/lib/redux/clientSlice";
import { AppDispatch } from "@/lib/store";
import { useSelector, useDispatch } from "react-redux";

export default function Clients() {
  const dispatch = useDispatch<AppDispatch>();
  const clients = useSelector(selectClients);
  const loading = useSelector(selectLoading);
  const pagination = useSelector(selectPagination);
  const currentPage = useSelector(selectCurrentPage);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
//   const [importModalOpen, setImportModalOpen] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [deleteClient, setDeleteClient] = useState<Client | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [form, setForm] = useState<Omit<Client, "_id" | "createdOn" | "updatedOn">>({
    name: "",
    email: "",
    phoneNumber: "",
    status: "New",
  });

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch clients when filters or page change
  useEffect(() => {
    dispatch(fetchClients({ search: debouncedSearch, status: statusFilter === 'all' ? undefined : statusFilter, page: currentPage }));
  }, [dispatch, debouncedSearch, statusFilter, currentPage]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    // When filter changes, go back to page 1
    dispatch(fetchClients({ search: debouncedSearch, status: value === 'all' ? undefined : value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= pagination.totalPages) {
      dispatch(fetchClients({ search: debouncedSearch, status: statusFilter === 'all' ? undefined : statusFilter, page }));
    }
  };

  const openAddModal = () => {
    setEditClient(null);
    setForm({ name: "", email: "", phoneNumber: "", status: "New" });
    setModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setEditClient(client);
    setForm({
      name: client.name,
      email: client.email,
      phoneNumber: client.phoneNumber,
      status: client.status,
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
      response = await dispatch(addClient(form as Client));
    }
    setFormLoading(false);

    if (response) {
      setModalOpen(false);
      dispatch(fetchClients({ search: debouncedSearch, status: statusFilter === 'all' ? undefined : statusFilter, page: currentPage }));
    }
  };

  const handleDelete = async () => {
    if (!deleteClient || !deleteClient._id) return;
    setDeleteLoading(true);
    const response = await dispatch(deleteClientAction(deleteClient._id));
    setDeleteLoading(false);

    if (response) {
      setDeleteClient(null); // Close confirmation dialog
      // If the last item on a page is deleted, fetch the previous page
      const newPage = clients.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      dispatch(fetchClients({ search: debouncedSearch, status: statusFilter === 'all' ? undefined : statusFilter, page: newPage }));
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

//   const handleImportSuccess = () => {
//     setImportModalOpen(false);
//     dispatch(fetchClients({ page: 1 }));
//   };

  return (
    <div className="w-full mx-auto mt-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Clients List</h1>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search clients..."
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
          {/* <Button variant="outline" size="sm" className="gap-1" onClick={() => setImportModalOpen(true)}>
            <Upload className="w-4 h-4" /> Import
          </Button> */}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>TlCode</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && clients.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8">Loading...</TableCell></TableRow>
                ) : clients.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8">No clients found.</TableCell></TableRow>
                ) : (
                  clients.map((client, idx) => (
                    <TableRow key={client._id}>
                      <TableCell>{(currentPage - 1) * 20 + idx + 1}</TableCell>
                      <TableCell><div className="font-medium">{client.name}</div></TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-500" /><span className="text-sm">{client.email}</span></div>
                          <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-500" /><span className="text-sm">{client.phoneNumber}</span></div>
                        </div>
                      </TableCell>
                      <TableCell><Badge className={`${getStatusColor(client.status)} text-white`}>{client.status}</Badge></TableCell>
                      <TableCell>{client.tlCode}</TableCell>
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
        <DialogContent>
          <DialogHeader><DialogTitle>{editClient ? 'Edit Client' : 'Add Client'}</DialogTitle></DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4 mt-2">
            <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input placeholder="phoneNumber" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} required />
            <Select value={form.status} onValueChange={(value: string) => setForm({ ...form, status: value })}><SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger><SelectContent><SelectItem value="New">New</SelectItem><SelectItem value="Contacted">Contacted</SelectItem><SelectItem value="Interested">Interested</SelectItem><SelectItem value="Not Interested">Not Interested</SelectItem><SelectItem value="Converted">Converted</SelectItem></SelectContent></Select>
            <DialogFooter>
              <Button type="submit" disabled={formLoading}>{formLoading ? 'Saving...' : (editClient ? 'Update Client' : 'Add Client')}</Button>
              <DialogClose asChild><Button type="button" variant="outline" disabled={formLoading}>Cancel</Button></DialogClose>
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
              <PaginationItem><PaginationPrevious href="#" onClick={() => handlePageChange(currentPage - 1)} /></PaginationItem>
              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink href="#" isActive={currentPage === i + 1} onClick={() => handlePageChange(i + 1)}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem><PaginationNext href="#" onClick={() => handlePageChange(currentPage + 1)} /></PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
// change end