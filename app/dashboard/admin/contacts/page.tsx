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
import { Phone, Mail, Loader2, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchContacts,
  updateContact, // Make sure to import updateContact
  selectContacts,
  selectLoading,
  selectPagination,
  Contact,
} from "@/lib/redux/contactSlice";
import { AppDispatch, RootState } from "@/lib/store";

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
  const debouncedSearch = useDebounce(search, 500); // Debounce search input
  const [page, setPage] = useState(1);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  
  // State for the modal
  const [modalOpen, setModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  // The limit of items per page. Should match your backend default or be passed.
  const ITEMS_PER_PAGE = 8;

  // Main effect to fetch data when page or search query changes
  useEffect(() => {
    dispatch(fetchContacts({ page, searchQuery: debouncedSearch, limit: ITEMS_PER_PAGE }));
  }, [dispatch, page, debouncedSearch]);

  // Effect to reset to page 1 when a new search is performed
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);


  // ---- Modal and Update Logic ----
  const openUpdateModal = (contact: Contact) => {
    setEditContact(contact);
    setNewStatus(contact.status || "New");
    setModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!editContact || !editContact._id || !newStatus) return;
    setIsUpdating(true);
    try {
      await dispatch(updateContact(editContact._id, { status: newStatus }));
      // Refetch the current page to show updated data
      dispatch(fetchContacts({ page, searchQuery: debouncedSearch, limit: ITEMS_PER_PAGE }));
      setModalOpen(false);
    } finally {
      setIsUpdating(false);
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
        <h1 className="text-3xl font-bold">Contacts ({totalContacts})</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Input
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80"
          />
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isListLoading && contacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Loading contacts...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : contacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No contacts found for this query.
                    </TableCell>
                  </TableRow>
                ) : (
                  contacts.map((contact, idx) => (
                    <TableRow key={contact._id}>
                      <TableCell>{(page - 1) * ITEMS_PER_PAGE + idx + 1}</TableCell>
                      <TableCell>
                        <div className="font-medium">{contact.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{contact.email}</span>
                          </div>
                          {contact.phoneNumber && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-500" />
                              <span className="text-sm">{contact.phoneNumber}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(contact.status as string)} text-white hover:bg-opacity-80`}>
                          {contact.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openUpdateModal(contact)}
                        >
                          Update Status
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page <= 1 || isListLoading}
          >
            <ChevronsLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages || isListLoading}
          >
            Next
            <ChevronsRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Update Status Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Status for {editContact?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Select
              value={newStatus}
              onValueChange={setNewStatus}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-full">
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
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isUpdating}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleStatusUpdate}
              disabled={isUpdating || newStatus === editContact?.status}
            >
              {isUpdating ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
              ) : ('Save Changes')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}