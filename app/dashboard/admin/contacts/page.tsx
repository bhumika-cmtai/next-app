"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, Loader2, ChevronsLeft, ChevronsRight, Download, Trash2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  fetchContacts,
  updateContact,
  deleteContact,
  selectContacts,
  selectLoading,
  selectPagination,
  Contact, // Assuming Contact type now includes `reason?: string`
} from "@/lib/redux/contactSlice";
import { AppDispatch } from "@/lib/store";

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

export default function Contacts() {
  const dispatch = useDispatch<AppDispatch>();
  
  // Selectors for Redux state
  const contacts = useSelector(selectContacts);
  const { currentPage, totalPages, totalContacts } = useSelector(selectPagination);
  const isListLoading = useSelector(selectLoading);

  // Local state for UI interactions
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  
  // State for the update modal
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [reason, setReason] = useState(""); // State for the 'NotInterested' reason
  const [isUpdating, setIsUpdating] = useState(false);
  
  // State for delete confirmation modal
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // State for the export modal
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportStatus, setExportStatus] = useState("all");

  const ITEMS_PER_PAGE = 8;

  // Fetch contacts when page or search query changes
  useEffect(() => {
    dispatch(fetchContacts({ page, searchQuery: debouncedSearch, limit: ITEMS_PER_PAGE }));
  }, [dispatch, page, debouncedSearch]);

  // Reset to page 1 when a new search is performed
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // Handler to open the update modal
  const openUpdateModal = (contact: Contact) => {
    setEditContact(contact);
    setNewStatus(contact.status || "New");
    setReason(contact.reason || ""); // Initialize reason state
    setModalOpen(true);
  };

  // Handler to submit the status update
  const handleStatusUpdate = async () => {
    if (!editContact || !editContact._id || !newStatus) return;
    if (newStatus === 'NotInterested' && !reason.trim()) {
        toast.error("A reason is required when status is 'Not Interested'.");
        return;
    }

    setIsUpdating(true);
    try {
      const payload: { status: string; reason?: string } = { status: newStatus };
      if (newStatus === 'NotInterested') {
        payload.reason = reason;
      } else {
        // Ensure reason is cleared if status is not 'NotInterested'
        payload.reason = ''; 
      }
      
      await dispatch(updateContact(editContact._id, payload));
      
      // Refetch the current page to show updated data
      dispatch(fetchContacts({ page, searchQuery: debouncedSearch, limit: ITEMS_PER_PAGE }));
      setModalOpen(false);
      toast.success("Contact status updated successfully!");
    } catch (error) {
      toast.error("Failed to update contact status.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handler to open the delete confirmation modal
  const openDeleteConfirmation = (contact: Contact) => {
    setContactToDelete(contact);
  };

  // Handler to submit the deletion
  const handleDeleteContact = async () => {
    if (!contactToDelete?._id) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteContact(contactToDelete._id));
      toast.success(`Contact for "${contactToDelete.name}" has been deleted.`);
      setContactToDelete(null); // Close the dialog

      const newPage = contacts.length === 1 && page > 1 ? page - 1 : page;
      if (newPage !== page) {
        setPage(newPage);
      } else {
        dispatch(fetchContacts({ page, searchQuery: debouncedSearch, limit: ITEMS_PER_PAGE }));
      }
    } catch (error) {
      toast.error("Failed to delete contact.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Function to handle the CSV export
  const handleExport = () => {
    if (!contacts || contacts.length === 0) {
        toast.warning("There is no contact data to export.");
        return;
    }
      
    const filteredContacts = exportStatus === "all" 
      ? contacts 
      : contacts.filter(contact => contact.status === exportStatus);
    
    if (filteredContacts.length === 0) {
        toast.warning(`No contacts found with the status "${exportStatus}".`);
        return;
    }

    const headers = ["Name", "Email", "Phone Number", "Status", "Remark"];
    const csvContent = [
      headers.join(","),
      ...filteredContacts.map(contact => [
        `"${contact.name.replace(/"/g, '""')}"`,
        `"${contact.email.replace(/"/g, '""')}"`,
        `"${contact.phoneNumber || ''}"`,
        `"${contact.status || 'N/A'}"`,
        `"${contact.reason || ''}"`,
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([`\uFEFF${csvContent}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `contacts-${exportStatus.toLowerCase()}-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setExportModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-blue-500";
      case "RegisterationDone": return "bg-green-500";
      case "CallCut": return "bg-orange-500";
      case "CallNotPickUp": return "bg-yellow-500";
      case "NotInterested": return "bg-red-500";
      case "InvalidNumber": return "bg-slate-600";
      default: return "bg-gray-400";
    }
  };

  return (
    <div className="w-full mx-auto mt-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Contacts ({totalContacts})</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80"
          />
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
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Remark</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isListLoading && contacts.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8"><div className="flex justify-center items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /><span>Loading contacts...</span></div></TableCell></TableRow>
                ) : contacts.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8">No contacts found.</TableCell></TableRow>
                ) : (
                  contacts.map((contact, idx) => (
                    <TableRow key={contact._id}>
                      <TableCell>{(page - 1) * ITEMS_PER_PAGE + idx + 1}</TableCell>
                      <TableCell><div className="font-medium">{contact.name}</div></TableCell>
                      <TableCell><div className="flex flex-col gap-1"><div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-500" /><span className="text-sm">{contact.email}</span></div>{contact.phoneNumber && (<div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-500" /><span className="text-sm">{contact.phoneNumber}</span></div>)}</div></TableCell>
                      <TableCell><Badge className={`${getStatusColor(contact.status as string)} text-white hover:bg-opacity-80`}>{contact.status}</Badge></TableCell>
                      <TableCell>{contact.reason || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="sm" onClick={() => openUpdateModal(contact)}>Update Status</Button>
                          <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => openDeleteConfirmation(contact)} title="Delete">
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
          <DialogHeader><DialogTitle>Update Status for {editContact?.name}</DialogTitle></DialogHeader>
          <div className="py-4 space-y-4">
            <Select value={newStatus} onValueChange={setNewStatus} disabled={isUpdating}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select Status" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="RegisterationDone">Registration Done</SelectItem>
                    <SelectItem value="CallCut">Call Cut</SelectItem>
                    <SelectItem value="CallNotPickUp">Call Not Pick Up</SelectItem>
                    <SelectItem value="NotInterested">Not Interested</SelectItem>
                    <SelectItem value="InvalidNumber">Invalid Number</SelectItem>
                </SelectContent>
            </Select>
            {newStatus === 'NotInterested' && (
                <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                    <Input
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Enter reason for not being interested"
                        disabled={isUpdating}
                        className="w-full"
                    />
                </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline" disabled={isUpdating}>Cancel</Button></DialogClose>
            <Button 
                type="button" 
                onClick={handleStatusUpdate} 
                disabled={isUpdating || (newStatus === editContact?.status && reason === (editContact?.reason || '')) || (newStatus === 'NotInterested' && !reason.trim())}>
                {isUpdating ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>) : ('Save Changes')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!contactToDelete} onOpenChange={(open) => !open && setContactToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contact</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the contact for <b>{contactToDelete?.name}</b>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContactToDelete(null)} disabled={isDeleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteContact} disabled={isDeleting}>
              {isDeleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Export Contacts Dialog */}
      <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Export Contacts</DialogTitle>
            <DialogDescription>Choose a status to filter contacts for export, or export all.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={exportStatus} onValueChange={setExportStatus}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select Status"/></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="RegisterationDone">Registration Done</SelectItem>
                <SelectItem value="CallCut">Call Cut</SelectItem>
                <SelectItem value="CallNotPickUp">Call Not Pick Up</SelectItem>
                <SelectItem value="NotInterested">Not Interested</SelectItem>
                <SelectItem value="InvalidNumber">Invalid Number</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={handleExport}>Export CSV</Button>
            <Button variant="outline" onClick={() => setExportModalOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}