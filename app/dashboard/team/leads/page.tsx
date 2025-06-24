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
import { fetchLeads, selectLeads, selectLoading, selectPagination, selectCurrentPage, Lead, updateLead, deleteLead as deleteLeadAction } from "@/lib/redux/leadSlice";
import { AppDispatch } from "@/lib/store";
import { useSelector, useDispatch } from "react-redux";

export default function Leads() {
  const dispatch = useDispatch<AppDispatch>();
  const leads = useSelector(selectLeads);
  const loading = useSelector(selectLoading);
  const pagination = useSelector(selectPagination);
  const currentPage = useSelector(selectCurrentPage);

  // State for the initial identity confirmation view
  const [identityConfirmed, setIdentityConfirmed] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [portalName, setPortalName] = useState("");

  // State for the leads table view
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [deleteLead, setDeleteLead] = useState<Lead | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [form, setForm] = useState<Omit<Lead, "_id" | "createdOn" | "updatedOn">>({
    name: "",
    email: "",
    phoneNumber: "",
    source: "Website",
    status: "New",
    message: "",
  });

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch leads only after identity is confirmed and when filters or page change
  useEffect(() => {
    if (identityConfirmed) {
      dispatch(fetchLeads({ search: debouncedSearch, status: statusFilter === 'all' ? undefined : statusFilter, page: currentPage }));
    }
  }, [dispatch, debouncedSearch, statusFilter, currentPage, identityConfirmed]);

  const handleConfirmIdentity = (e: FormEvent) => {
    e.preventDefault();
    // Use the mobile number as the initial search term for the leads table
    setSearch(mobileNumber);
    // The portal name is not used in the fetch logic but is part of the form
    setIdentityConfirmed(true);
  };
  
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    // When filter changes, go back to page 1
    dispatch(fetchLeads({ search: debouncedSearch, status: value === 'all' ? undefined : value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= pagination.totalPages) {
      dispatch(fetchLeads({ search: debouncedSearch, status: statusFilter === 'all' ? undefined : statusFilter, page }));
    }
  };

  const openAddModal = () => {
    setEditLead(null);
    setForm({ name: "", email: "", phoneNumber: "", source: "Website", status: "New", message: "" });
    setModalOpen(true);
  };

  const openEditModal = (lead: Lead) => {
    setEditLead(lead);
    setForm({
      name: lead.name,
      email: lead.email,
      phoneNumber: lead.phoneNumber,
      source: lead.source,
      status: lead.status,
      message: lead.message,
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    let response;
    if (editLead && editLead._id) {
      response = await dispatch(updateLead(editLead._id, { ...editLead, ...form }));
    } else {
    //   response = await dispatch(addLead(form as Lead));
    }
    setFormLoading(false);

    if (response) {
      setModalOpen(false);
      dispatch(fetchLeads({ search: debouncedSearch, status: statusFilter === 'all' ? undefined : statusFilter, page: currentPage }));
    }
  };

  const handleDelete = async () => {
    if (!deleteLead || !deleteLead._id) return;
    setDeleteLoading(true);
    const response = await dispatch(deleteLeadAction(deleteLead._id));
    setDeleteLoading(false);

    if (response) {
      setDeleteLead(null); // Close confirmation dialog
      // If the last item on a page is deleted, fetch the previous page
      const newPage = leads.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      dispatch(fetchLeads({ search: debouncedSearch, status: statusFilter === 'all' ? undefined : statusFilter, page: newPage }));
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

  const handleImportSuccess = () => {
    setImportModalOpen(false);
    dispatch(fetchLeads({ page: 1 }));
  };
  
  if (!identityConfirmed) {
    return (
      <div className="flex justify-center items-center py-10">
          <Card className="w-full max-w-4xl">
            <CardContent className="p-8 flex flex-col items-center gap-6">
              <h1 className="text-3xl font-bold">User Dashboard</h1>
              <form onSubmit={handleConfirmIdentity} className="w-full flex flex-col sm:flex-row items-center justify-center gap-4">
                <Input
                  placeholder="Enter Mobile Number"
                  value={mobileNumber}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setMobileNumber(e.target.value)}
                  className="w-full sm:w-auto sm:flex-1"
                />
                <Input
                  placeholder="Enter Portal Name"
                  value={portalName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPortalName(e.target.value)}
                  className="w-full sm:w-auto sm:flex-1"
                />
                <Button type="submit" className="bg-black text-white hover:bg-gray-900 w-full sm:w-auto">
                  Confirm Identity
                </Button>
              </form>
            </CardContent>
          </Card>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto mt-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Leads List</h1>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search leads..."
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
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Lead</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Portal</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && leads.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8">Loading...</TableCell></TableRow>
                ) : leads.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8">No leads found.</TableCell></TableRow>
                ) : (
                  leads.map((lead, idx) => (
                    <TableRow key={lead._id}>
                      <TableCell>{(currentPage - 1) * 20 + idx + 1}</TableCell>
                      <TableCell><div className="font-medium">{lead.name}</div></TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-500" /><span className="text-sm">{lead.email}</span></div>
                          <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-500" /><span className="text-sm">{lead.phoneNumber}</span></div>
                        </div>
                      </TableCell>
                      <TableCell>{lead.source}</TableCell>
                      <TableCell><Badge className={`${getStatusColor(lead.status)} text-white`}>{lead.status}</Badge></TableCell>
                      <TableCell>{lead.createdOn ? new Date(parseInt(lead.createdOn)).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost" onClick={() => openEditModal(lead)}><Edit className="w-4 h-4" /></Button>
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