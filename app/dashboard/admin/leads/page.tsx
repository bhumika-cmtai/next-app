"use client";

import React, { useState, ChangeEvent, useEffect, FormEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, Edit, Trash2, Mail, Phone, Download, Loader2 } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { fetchLeads, selectLeads, selectLoading, selectPagination, selectCurrentPage, Lead, addLead, updateLead, deleteLead as deleteLeadAction } from "@/lib/redux/leadSlice";
import { AppDispatch } from "@/lib/store";
import { useSelector, useDispatch } from "react-redux";
import ImportLeads from "./importLeads";
import AgeCell from "@/components/ui/AgeCell";
import { Label } from "@/components/ui/label";

// Define the initial state for our expanded form, matching the Lead interface
const initialFormState: Omit<Lead, "_id" | "createdOn" | "updatedOn"> = {
  name: "",
  email: "",
  phoneNumber: "",
  portal_name: "",
  qualification: "",
  city: "",
  date_of_birth: "",
  gender: "",
  message: "",
  status: "New",
  source: "",
  ekyc_stage: 'notComplete',
  trade_status: 'notMatched', // Matches the typo in your slice
};

export default function Leads() {
  const dispatch = useDispatch<AppDispatch>();
  const leads = useSelector(selectLeads);
  const loading = useSelector(selectLoading);
  const pagination = useSelector(selectPagination);
  const currentPage = useSelector(selectCurrentPage);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [form, setForm] = useState(initialFormState);
  
  const [deleteLead, setDeleteLead] = useState<Lead | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportStatus, setExportStatus] = useState("all");

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch leads when filters or page change
  useEffect(() => {
    dispatch(fetchLeads({ search: debouncedSearch, status: statusFilter === 'all' ? undefined : statusFilter, page: currentPage }));
  }, [dispatch, debouncedSearch, statusFilter, currentPage]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= pagination.totalPages) {
      dispatch(fetchLeads({ search: debouncedSearch, status: statusFilter === 'all' ? undefined : statusFilter, page }));
    }
  };
  
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    handlePageChange(1); // Reset to page 1 on new filter
  };

  const openAddModal = () => {
    setEditLead(null);
    setForm(initialFormState);
    setModalOpen(true);
  };

  const openEditModal = (lead: Lead) => {
    setEditLead(lead);
    setForm({
      name: lead.name ?? '',
      email: lead.email ?? '',
      phoneNumber: lead.phoneNumber ?? '',
      portal_name: lead.portal_name ?? '',
      qualification: lead.qualification ?? '',
      city: lead.city ?? '',
      date_of_birth: lead.date_of_birth ? lead.date_of_birth.split('T')[0] : '', // Format date for input
      gender: lead.gender ?? '',
      message: lead.message ?? '',
      status: lead.status ?? 'New',
      source: lead.source ?? '',
      ekyc_stage: lead.ekyc_stage ?? 'notComplete',
      trade_status: lead.trade_status ?? 'notMatched',
    });
    setModalOpen(true);
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleFormSelectChange = (fieldName: string, value: string) => {
    setForm({ ...form, [fieldName]: value });
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    let response;
    if (editLead && editLead._id) {
      response = await dispatch(updateLead(editLead._id, { ...editLead, ...form }));
    } else {
      response = await dispatch(addLead(form as Lead));
    }
    setFormLoading(false);

    if (response) {
      setModalOpen(false);
      dispatch(fetchLeads({ search: debouncedSearch, status: statusFilter === 'all' ? undefined : statusFilter, page: currentPage }));
    }
  };

  const handleDelete = async () => {
    if (!deleteLead?._id) return;
    setDeleteLoading(true);
    await dispatch(deleteLeadAction(deleteLead._id));
    setDeleteLoading(false);
    setDeleteLead(null);
    const newPage = leads.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
    dispatch(fetchLeads({ search: debouncedSearch, status: statusFilter === 'all' ? undefined : statusFilter, page: newPage }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-blue-500";
      case "RegisterationDone": return "bg-green-500";
      case "NotInterested": return "bg-orange-400";
      case "CallCut": return "bg-red-500";
      case "CallNotPickUp": return "bg-yellow-500";
      case "InvalidNumber": return "bg-gray-400";
      default: return "bg-gray-500";
    }
  };
  
  const handleExport = () => {
    const filteredLeads = exportStatus === "all" 
      ? leads 
      : leads.filter(lead => lead.status === exportStatus);
    
    const headers = ["Name", "Email", "Phone", "Status", "Source", "Message", "Created"];
    const csvContent = [
      headers.join(","),
      ...filteredLeads.map(lead => [
        `"${lead.name.replace(/"/g, '""')}"`,
        `"${lead.email.replace(/"/g, '""')}"`,
        `"${lead.phoneNumber}"`,
        `"${lead.status}"`,
        `"${lead.source}"`,
        `"${(lead.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
        `"${lead.createdOn ? new Date(lead.createdOn).toLocaleDateString() : ''}"`
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([`\uFEFF${csvContent}`], { type: "text/csv;charset=utf-8;" }); // Add BOM for Excel compatibility
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `leads-${exportStatus.toLowerCase()}-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setExportModalOpen(false);
  };

  return (
    <div className="w-full mx-auto mt-2 ">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Leads List</h1>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Input placeholder="Search leads..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-48"/>
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="RegisterationDone">Registration Done</SelectItem>
              <SelectItem value="CallCut">Call Cut</SelectItem>
              <SelectItem value="CallNotPickUp">Call Not Picked Up</SelectItem>
              <SelectItem value="NotInterested">Not Interested</SelectItem>
              <SelectItem value="InvalidNumber">Invalid Number</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="default" size="sm" className="gap-1" onClick={openAddModal}><Plus className="w-4 h-4"/> Add Lead</Button>
          <Button variant="outline" size="sm" className="gap-1" onClick={() => setImportModalOpen(true)}><Upload className="w-4 h-4"/> Import</Button>
          <Button variant="outline" size="sm" className="gap-1" onClick={() => setExportModalOpen(true)}><Download className="w-4 h-4"/> Export</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">S. No.</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Lead Name</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Remark</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && leads.length === 0 ? (
                  <TableRow><TableCell colSpan={9} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto"/></TableCell></TableRow>
                ) : leads.length === 0 ? (
                  <TableRow><TableCell colSpan={9} className="text-center py-8">No leads found.</TableCell></TableRow>
                ) : (
                  leads.map((lead, idx) => (
                    <TableRow key={lead._id}>
                      <TableCell>{(currentPage - 1) * 20 + idx + 1}</TableCell>
                      <TableCell>{lead.createdOn ? new Date(lead.createdOn).toLocaleDateString() : '-'}</TableCell>
                      <TableCell><div className="font-medium">{lead.name}</div></TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-500" /><span className="text-sm">{lead.email || '-'}</span></div>
                          <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-500" /><span className="text-sm">{lead.phoneNumber}</span></div>
                        </div>
                      </TableCell>
                      <TableCell><AgeCell dateOfBirth={lead.date_of_birth} /></TableCell>
                      <TableCell><div className="font-medium">{lead.city || '-'}</div></TableCell>
                      <TableCell><Badge className={`${getStatusColor(lead.status)} text-white`}>{lead.status}</Badge></TableCell>
                      <TableCell><div className="max-w-[200px] truncate text-sm text-gray-600">{lead.message || '-'}</div></TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost" onClick={() => openEditModal(lead)} title="Edit"><Edit className="w-4 h-4" /></Button>
                          <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => setDeleteLead(lead)} title="Delete"><Trash2 className="w-4 h-4" /></Button>
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

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader><DialogTitle>{editLead ? 'Edit Lead' : 'Add New Lead'}</DialogTitle></DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4 mt-2 max-h-[70vh] overflow-y-auto pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="name">Name*</Label><Input id="name" name="name" value={form.name} onChange={handleFormChange} required /></div>
              <div className="space-y-2"><Label htmlFor="phoneNumber">Phone Number*</Label><Input id="phoneNumber" name="phoneNumber" value={form.phoneNumber} onChange={handleFormChange} required /></div>
              {/* <div className="space-y-2"><Label htmlFor="portal_name">Portal Name*</Label><Input id="portal_name" name="portal_name" value={form.portal_name} onChange={handleFormChange} required /></div> */}
              <div className="space-y-2"><Label htmlFor="portal_name">Portal Name*</Label><Select value={form.portal_name} onValueChange={(value) => handleFormSelectChange('portal_name', value)}><SelectTrigger><SelectValue placeholder="Select Portal"/></SelectTrigger><SelectContent><SelectItem value="angel-list">angel-list</SelectItem><SelectItem value="airtel-payment">airtel-payment</SelectItem><SelectItem value="paytm">paytm</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" value={form.email} onChange={handleFormChange} /></div>
              <div className="space-y-2"><Label htmlFor="city">City</Label><Input id="city" name="city" value={form.city} onChange={handleFormChange} /></div>
              <div className="space-y-2"><Label htmlFor="qualification">Qualification</Label><Input id="qualification" name="qualification" value={form.qualification} onChange={handleFormChange} /></div>
              <div className="space-y-2"><Label htmlFor="date_of_birth">Date of Birth</Label><Input id="date_of_birth" name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleFormChange} /></div>
              <div className="space-y-2"><Label htmlFor="gender">Gender</Label><Select value={form.gender} onValueChange={(value) => handleFormSelectChange('gender', value)}><SelectTrigger><SelectValue placeholder="Select Gender"/></SelectTrigger><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label htmlFor="source">Source</Label><Select value={form.source} onValueChange={(value) => handleFormSelectChange('source', value)}><SelectTrigger><SelectValue placeholder="Select Source"/></SelectTrigger><SelectContent><SelectItem value="angel-list">angel-list</SelectItem><SelectItem value="airtel-payment">airtel-payment</SelectItem><SelectItem value="paytm">paytm</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label htmlFor="status">Status</Label><Select value={form.status} onValueChange={(value) => handleFormSelectChange('status', value)}><SelectTrigger><SelectValue placeholder="Select Status"/></SelectTrigger><SelectContent><SelectItem value="New">New</SelectItem><SelectItem value="RegisterationDone">Registration Done</SelectItem><SelectItem value="CallCut">Call Cut</SelectItem><SelectItem value="CallNotPickUp">Call Not Picked Up</SelectItem><SelectItem value="NotInterested">Not Interested</SelectItem><SelectItem value="InvalidNumber">Invalid Number</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label htmlFor="ekyc_stage">eKYC Stage</Label><Select value={form.ekyc_stage} onValueChange={(value) => handleFormSelectChange('ekyc_stage', value)}><SelectTrigger><SelectValue placeholder="Select eKYC Stage"/></SelectTrigger><SelectContent><SelectItem value="notComplete">Not Complete</SelectItem><SelectItem value="complete">Complete</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label htmlFor="trade_status">Trade Status</Label><Select value={form.trade_status} onValueChange={(value) => handleFormSelectChange('trade_status', value)}><SelectTrigger><SelectValue placeholder="Select Trade Status"/></SelectTrigger><SelectContent><SelectItem value="notMatched">Not Matched</SelectItem><SelectItem value="matched">Matched</SelectItem></SelectContent></Select></div>
              <div className="space-y-2 md:col-span-2"><Label htmlFor="message">Remark / Message</Label><textarea id="message" name="message" className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-sm" placeholder="Add a note..." value={form.message} onChange={handleFormChange}/></div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline" disabled={formLoading}>Cancel</Button></DialogClose>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                {formLoading ? 'Saving...' : (editLead ? 'Update Lead' : 'Add Lead')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={!!deleteLead} onOpenChange={(open) => !open && setDeleteLead(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Lead</DialogTitle><DialogDescription>Are you sure you want to delete the lead for <b>{deleteLead?.name}</b>? This action cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>{deleteLoading ? 'Deleting...' : 'Delete'}</Button>
            <DialogClose asChild><Button type="button" variant="outline" disabled={deleteLoading}>Cancel</Button></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ImportLeads open={importModalOpen} onOpenChange={setImportModalOpen} onImportSuccess={() => dispatch(fetchLeads())} />

      <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader><DialogTitle>Export Leads</DialogTitle><DialogDescription>Choose a status to filter leads for export</DialogDescription></DialogHeader>
          <div className="py-4"><Select value={exportStatus} onValueChange={setExportStatus}><SelectTrigger className="w-full"><SelectValue placeholder="Select Status"/></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="New">New</SelectItem><SelectItem value="RegisterationDone">Registration Done</SelectItem><SelectItem value="CallCut">Call Cut</SelectItem><SelectItem value="CallNotPickUp">Call Not Picked Up</SelectItem><SelectItem value="NotInterested">Not Interested</SelectItem><SelectItem value="InvalidNumber">Invalid Number</SelectItem></SelectContent></Select></div>
          <DialogFooter><Button onClick={handleExport}>Export CSV</Button><Button variant="outline" onClick={() => setExportModalOpen(false)}>Cancel</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {pagination.totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem><PaginationPrevious href="#" onClick={() => handlePageChange(currentPage - 1)} /></PaginationItem>
              {Array.from({ length: pagination.totalPages }, (_, i) => (<PaginationItem key={i + 1}><PaginationLink href="#" isActive={currentPage === i + 1} onClick={() => handlePageChange(i + 1)}>{i + 1}</PaginationLink></PaginationItem>))}
              <PaginationItem><PaginationNext href="#" onClick={() => handlePageChange(currentPage + 1)} /></PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}