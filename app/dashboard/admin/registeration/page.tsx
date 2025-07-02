"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Phone, Loader2, ChevronsLeft, ChevronsRight, Hash, MoreHorizontal, Trash2, Edit } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";

import {
  fetchRegisterations,
  updateRegisteration,
  deleteRegisteration, // Import the delete thunk
  selectRegisterations,
  selectRegisterationLoading,
  selectRegisterationPagination,
  Registeration,
} from "@/lib/redux/registerationSlice";
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
  const [isUpdating, setIsUpdating] = useState(false);
  
  // State for the delete confirmation dialog
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [registerationToDelete, setRegisterationToDelete] = useState<Registeration | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const ITEMS_PER_PAGE = 8;

  const refetchData = () => {
    dispatch(fetchRegisterations({ 
      page, 
      name: debouncedName,
      phoneNumber: debouncedPhone,
      leaderCode: debouncedCode,
      status: statusFilter, 
      limit: ITEMS_PER_PAGE 
    }));
  };

  // Main effect to fetch data when page or any filter changes
  useEffect(() => {
    refetchData();
  }, [dispatch, page, debouncedName, debouncedPhone, debouncedCode, statusFilter]);
  
  // Effect to reset to page 1 when a new search or filter is applied
  useEffect(() => {
    setPage(1);
  }, [debouncedName, debouncedPhone, debouncedCode, statusFilter]);

  // Update Logic
  const openUpdateModal = (registeration: Registeration) => {
    setEditRegisteration(registeration);
    setNewStatus(registeration.status || "New");
    setModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!editRegisteration || !editRegisteration._id || !newStatus) return;
    setIsUpdating(true);
    try {
      await dispatch(updateRegisteration(editRegisteration._id, { status: newStatus }));
      refetchData(); // Refetch the current page to show updated data
      setModalOpen(false);
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
      // If the deleted item was the last one on the page, go to the previous page
      if (registrations.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        refetchData();
      }
      setDeleteConfirmOpen(false);
    } finally {
      setIsDeleting(false);
      setRegisterationToDelete(null);
    }
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isListLoading && (!registrations || registrations.length === 0) ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8"><div className="flex justify-center items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /><span>Loading...</span></div></TableCell></TableRow>
                ) : !registrations || registrations.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8">No registrations found.</TableCell></TableRow>
                ) : (
                  registrations.map((register, idx) => (
                    <TableRow key={register._id}>
                      <TableCell>{(page - 1) * ITEMS_PER_PAGE + idx + 1}</TableCell>
                      <TableCell><div className="font-medium">{register.name}</div></TableCell>
                      <TableCell><div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-500" /><span className="text-sm">{register.phoneNumber}</span></div></TableCell>
                      <TableCell><div className="flex items-center gap-2 font-mono text-sm"><Hash className="w-3 h-3 text-gray-500"/>{register.leaderCode || 'N/A'}</div></TableCell>
                      <TableCell><Badge className={`${getStatusColor(register.status)} text-white`}>{register.status}</Badge></TableCell>
                      <TableCell>{register.createdOn ? new Date(parseInt(register.createdOn)).toLocaleDateString() : '-'}</TableCell>
                      <TableCell className="text-right">
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Button variant="ghost" className="h-8 w-8 p-0">
                               <span className="sr-only">Open menu</span>
                               <MoreHorizontal className="h-4 w-4" />
                             </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end">
                             <DropdownMenuLabel>Actions</DropdownMenuLabel>
                             <DropdownMenuItem onClick={() => openUpdateModal(register)}>
                               <Edit className="mr-2 h-4 w-4" />
                               <span>Update Status</span>
                             </DropdownMenuItem>
                             <DropdownMenuItem className="text-red-600" onClick={() => openDeleteModal(register)}>
                               <Trash2 className="mr-2 h-4 w-4" />
                               <span>Delete</span>
                             </DropdownMenuItem>
                           </DropdownMenuContent>
                         </DropdownMenu>
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
          <div className="py-4">
            <Select value={newStatus} onValueChange={setNewStatus} disabled={isUpdating}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select Status" /></SelectTrigger>
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
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline" disabled={isUpdating}>Cancel</Button></DialogClose>
            <Button type="button" onClick={handleStatusUpdate} disabled={isUpdating || newStatus === editRegisteration?.status}>{isUpdating ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>) : ('Save Changes')}</Button>
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
    </div>
  );
}