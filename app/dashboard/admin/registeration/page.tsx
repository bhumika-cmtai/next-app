"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Phone, Loader2, ChevronsLeft, ChevronsRight, Hash, Trash2, Download } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";

import {
  fetchRegisterations,
  updateRegisteration,
  deleteRegisteration,
  selectRegisterations,
  selectRegisterationLoading,
  selectRegisterationPagination,
  Registeration,
} from "@/lib/redux/registerationSlice";
import { AppDispatch } from "@/lib/store";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Debounce hook for search functionality
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export default function RegistrationsPage() {
  const dispatch = useDispatch<AppDispatch>();
  
  // Selectors for Redux state
  const registrations = useSelector(selectRegisterations);
  const { currentPage, totalPages, totalRegisterations } = useSelector(selectRegisterationPagination);
  const isListLoading = useSelector(selectRegisterationLoading);

  // State for search boxes and filters
  const [nameSearch, setNameSearch] = useState("");
  const [phoneSearch, setPhoneSearch] = useState("");
  const [codeSearch, setCodeSearch] = useState("");
  
  // Debounce each search input
  const debouncedName = useDebounce(nameSearch, 500);
  const debouncedPhone = useDebounce(phoneSearch, 500);
  const debouncedCode = useDebounce(codeSearch, 500);

  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  
  // State for the update modal
  const [editRegisteration, setEditRegisteration] = useState<Registeration | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [reason, setReason] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  
  // State for the delete confirmation dialog
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [registerationToDelete, setRegisterationToDelete] = useState<Registeration | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // State for the export modal
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportStatus, setExportStatus] = useState("all");

  const ITEMS_PER_PAGE = 8;

  // Main effect to fetch data when page or any filter changes
  useEffect(() => {
    dispatch(fetchRegisterations({ 
      page, 
      name: debouncedName,
      phoneNumber: debouncedPhone,
      leaderCode: debouncedCode,
      status: statusFilter, 
      limit: ITEMS_PER_PAGE 
    }));
  }, [dispatch, page, debouncedName, debouncedPhone, debouncedCode, statusFilter]);
  
  // Effect to reset to page 1 when a new search or filter is applied
  useEffect(() => {
    setPage(1);
  }, [debouncedName, debouncedPhone, debouncedCode, statusFilter]);

  const openUpdateModal = (registeration: Registeration) => {
    setEditRegisteration(registeration);
    setNewStatus(registeration.status || "New");
    setReason(registeration.reason || "");
    setModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!editRegisteration || !editRegisteration._id || !newStatus) return;
    setIsUpdating(true);

    const updateData: { status: string; reason?: string } = { status: newStatus };
    if (newStatus === 'NotInterested') {
      updateData.reason = reason;
    } else {
      updateData.reason = ''; // Clear reason if status changes
    }

    try {
      await dispatch(updateRegisteration(editRegisteration._id, updateData));
      toast.success("Registration status updated successfully!");
      // Refetch with current filters
      dispatch(fetchRegisterations({ page, name: debouncedName, phoneNumber: debouncedPhone, leaderCode: debouncedCode, status: statusFilter, limit: ITEMS_PER_PAGE }));
      setModalOpen(false);
    } catch (error) {
      toast.error("Failed to update status.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete Logic
  const openDeleteModal = (registeration: Registeration) => {
    setRegisterationToDelete(registeration);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!registerationToDelete?._id) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteRegisteration(registerationToDelete._id));
      toast.success("Registration deleted successfully.");
      
      const newPage = registrations.length === 1 && page > 1 ? page - 1 : page;
      if (newPage !== page) {
        setPage(newPage);
      } else {
        // Refetch with current filters
        dispatch(fetchRegisterations({ page, name: debouncedName, phoneNumber: debouncedPhone, leaderCode: debouncedCode, status: statusFilter, limit: ITEMS_PER_PAGE }));
      }
      setDeleteConfirmOpen(false);
    } catch (error) {
      toast.error("Failed to delete registration.");
    } finally {
      setIsDeleting(false);
      setRegisterationToDelete(null);
    }
  };

  // Function to handle the CSV export
  const handleExport = () => {
    if (!registrations || registrations.length === 0) {
        toast.warning("There is no registration data to export.");
        return;
    }
      
    const filteredRegistrations = exportStatus === "all" 
      ? registrations 
      : registrations.filter(reg => reg.status === exportStatus);
    
    if (filteredRegistrations.length === 0) {
        toast.warning(`No registrations found with the status "${exportStatus}".`);
        return;
    }

    const headers = ["Name", "Phone Number", "Leader Code", "Status", "Created On", "Remark"];
    const csvContent = [
      headers.join(","),
      ...filteredRegistrations.map(reg => [
        `"${reg.name.replace(/"/g, '""')}"`,
        `"${reg.phoneNumber.replace(/"/g, '""')}"`,
        `"${reg.leaderCode || 'N/A'}"`,
        `"${reg.status}"`,
        `"${reg.createdOn ? new Date(parseInt(reg.createdOn)).toISOString() : 'N/A'}"`,
        `"${(reg.reason || '').replace(/"/g, '""')}"`
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([`\uFEFF${csvContent}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `registrations-${exportStatus.toLowerCase()}-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setExportModalOpen(false);
    toast.success("Registration data has been exported.");
  };

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
        <h1 className="text-3xl font-bold">Registrations ({totalRegisterations})</h1>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Input placeholder="Search by Name..." value={nameSearch} onChange={(e) => setNameSearch(e.target.value)} className="w-full sm:w-auto md:w-40"/>
          <Input placeholder="Search by Phone..." value={phoneSearch} onChange={(e) => setPhoneSearch(e.target.value)} className="w-full sm:w-auto md:w-40"/>
          <Input placeholder="Search by Code..." value={codeSearch} onChange={(e) => setCodeSearch(e.target.value)} className="w-full sm:w-auto md:w-40"/>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-auto md:w-40"><SelectValue placeholder="All Status" /></SelectTrigger>
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
          <Button
            variant="outline"
            onClick={() => setExportModalOpen(true)}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Leader Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Remark</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isListLoading && (!registrations || registrations.length === 0) ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8"><div className="flex justify-center items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /><span>Loading...</span></div></TableCell></TableRow>
                ) : !registrations || registrations.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8">No registrations found.</TableCell></TableRow>
                ) : (
                  registrations.map((register, idx) => (
                    <TableRow key={register._id}>
                      <TableCell>{(page - 1) * ITEMS_PER_PAGE + idx + 1}</TableCell>
                      <TableCell><div className="font-medium">{register.name}</div></TableCell>
                      <TableCell><div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-500" /><span className="text-sm">{register.phoneNumber}</span></div></TableCell>
                      <TableCell><div className="flex items-center gap-2 font-mono text-sm"><Hash className="w-3 h-3 text-gray-500"/>{register.leaderCode || 'N/A'}</div></TableCell>
                      <TableCell><Badge className={`${getStatusColor(register.status)} text-white`}>{register.status}</Badge></TableCell>
                      <TableCell>{register.createdOn ? new Date(parseInt(register.createdOn)).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate text-sm text-gray-600" title={register.reason || ''}>
                            {register.status === 'NotInterested' && register.reason ? register.reason : '-'}
                        </div>
                      </TableCell>
                     <TableCell className="text-right">
                           <div className="flex gap-2 justify-end">
                             <Button variant="outline" size="sm" onClick={() => openUpdateModal(register)}>Update Status</Button>
                             <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => openDeleteModal(register)} title="Delete">
                               <Trash2 className="w-4 h-4" />
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
      
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 py-4">
          <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page <= 1 || isListLoading}><ChevronsLeft className="h-4 w-4 mr-1" />Previous</Button>
          <span className="text-sm font-medium">Page {currentPage} of {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page >= totalPages || isListLoading}>Next<ChevronsRight className="h-4 w-4 ml-1" /></Button>
        </div>
      )}

      {/* Update Status Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Update Status for {editRegisteration?.name}</DialogTitle></DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="status-select">Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus} disabled={isUpdating}>
                <SelectTrigger id="status-select" className="w-full"><SelectValue placeholder="Select Status" /></SelectTrigger>
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
            
            {newStatus === 'NotInterested' && (
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for "Not Interested"</Label>
                <Textarea 
                  id="reason" 
                  placeholder="e.g., Already has an account, not the right time..." 
                  value={reason} 
                  onChange={(e) => setReason(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline" disabled={isUpdating}>Cancel</Button></DialogClose>
            <Button type="button" onClick={handleStatusUpdate} disabled={isUpdating || (newStatus === editRegisteration?.status && reason === (editRegisteration.reason || ''))}>
              {isUpdating ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>) : ('Save Changes')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete the registration for <strong>{registerationToDelete?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline" disabled={isDeleting}>Cancel</Button></DialogClose>
            <Button type="button" variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Deleting...</>) : ('Delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Export Registrations</DialogTitle>
            <DialogDescription>
              Choose a status to filter registrations for export, or export all.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={exportStatus} onValueChange={setExportStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
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
          </div>
          <DialogFooter>
            <Button onClick={handleExport}>Export CSV</Button>
            <Button variant="outline" onClick={() => setExportModalOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}