"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Phone, Loader2, ChevronsLeft, ChevronsRight, Hash } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";

import {
  fetchLinkclicks,
  updateLinkclick,
  fetchPortalNames,
  selectLinkclicks,
  selectLoading,
  selectPagination,
  Linkclick,
} from "@/lib/redux/linkclickSlice";
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

export default function LinkclicksPage() {
  const dispatch = useDispatch<AppDispatch>();
  
  // Selectors for Redux state
  const linkclicks = useSelector(selectLinkclicks);
  const { currentPage, totalPages, totalLinkclicks } = useSelector(selectPagination);
  const portalNames = useSelector((state: RootState) => state.linkclicks.portalNames);
  const isListLoading = useSelector(selectLoading);

  // State for three separate search boxes
  const [nameSearch, setNameSearch] = useState("");
  const [phoneSearch, setPhoneSearch] = useState("");
  const [codeSearch, setCodeSearch] = useState("");
  
  // Debounce each search input individually
  const debouncedName = useDebounce(nameSearch, 500);
  const debouncedPhone = useDebounce(phoneSearch, 500);
  const debouncedCode = useDebounce(codeSearch, 500);

  // State for filters and pagination
  const [portalFilter, setPortalFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  
  // State for the update modal
  const [editLinkclick, setEditLinkclick] = useState<Linkclick | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  const ITEMS_PER_PAGE = 8; // Match with backend limit

  // Main effect to fetch data when page or any debounced filter changes
  useEffect(() => {
    dispatch(fetchLinkclicks({ 
      page, 
      name: debouncedName,
      phoneNumber: debouncedPhone,
      leaderCode: debouncedCode,
      portalName: portalFilter, 
      status: statusFilter, 
      limit: ITEMS_PER_PAGE 
    }));
  }, [dispatch, page, debouncedName, debouncedPhone, debouncedCode, portalFilter, statusFilter]);
  
  // Effect to fetch portal names once on mount
  useEffect(() => {
    dispatch(fetchPortalNames());
  }, [dispatch]);

  // Effect to reset to page 1 when a new search or filter is applied
  useEffect(() => {
    setPage(1);
  }, [debouncedName, debouncedPhone, debouncedCode, portalFilter, statusFilter]);

  // Modal and Update Logic
  const openUpdateModal = (linkclick: Linkclick) => {
    setEditLinkclick(linkclick);
    setNewStatus(linkclick.status || "New");
    setModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!editLinkclick || !editLinkclick._id || !newStatus) return;
    setIsUpdating(true);
    try {
      await dispatch(updateLinkclick(editLinkclick._id, { status: newStatus }));
      // Refetch the current page to show updated data
      dispatch(fetchLinkclicks({ page, name: debouncedName, phoneNumber: debouncedPhone, leaderCode: debouncedCode, portalName: portalFilter, status: statusFilter, limit: ITEMS_PER_PAGE }));
      setModalOpen(false);
    } finally {
      setIsUpdating(false);
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
        <h1 className="text-3xl font-bold">Link Clicks ({totalLinkclicks})</h1>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Input placeholder="Search by Name..." value={nameSearch} onChange={(e) => setNameSearch(e.target.value)} className="w-full sm:w-auto md:w-40"/>
          <Input placeholder="Search by Phone..." value={phoneSearch} onChange={(e) => setPhoneSearch(e.target.value)} className="w-full sm:w-auto md:w-40"/>
          <Input placeholder="Search by Code..." value={codeSearch} onChange={(e) => setCodeSearch(e.target.value)} className="w-full sm:w-auto md:w-40"/>
          <Select value={portalFilter} onValueChange={setPortalFilter}>
            <SelectTrigger className="w-full sm:w-auto md:w-40"><SelectValue placeholder="All Portals" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Portals</SelectItem>
              {portalNames.map((name: string) => (<SelectItem key={name} value={name}>{name}</SelectItem>))}
            </SelectContent>
          </Select>
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
                  <TableHead>Leader Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Portal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isListLoading && (!linkclicks || linkclicks.length === 0) ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8"><div className="flex justify-center items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /><span>Loading...</span></div></TableCell></TableRow>
                ) : !linkclicks || linkclicks.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8">No link clicks found.</TableCell></TableRow>
                ) : (
                  linkclicks.map((linkclick, idx) => (
                    <TableRow key={linkclick._id}>
                      <TableCell>{(page - 1) * ITEMS_PER_PAGE + idx + 1}</TableCell>
                      <TableCell><div className="flex items-center gap-2 font-mono text-sm"><Hash className="w-3 h-3 text-gray-500"/>{linkclick.leaderCode || 'N/A'}</div></TableCell>
                      <TableCell><div className="font-medium">{linkclick.name}</div></TableCell>
                      <TableCell><div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-500" /><span className="text-sm">{linkclick.phoneNumber}</span></div></TableCell>
                      <TableCell>{linkclick.portalName || 'N/A'}</TableCell>
                      <TableCell><Badge className={`${getStatusColor(linkclick.status)} text-white`}>{linkclick.status}</Badge></TableCell>
                      <TableCell>{linkclick.createdOn ? new Date(parseInt(linkclick.createdOn)).toLocaleDateString() : '-'}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => openUpdateModal(linkclick)}>Update Status</Button>
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

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Update Status for {editLinkclick?.name}</DialogTitle></DialogHeader>
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
            <Button type="button" onClick={handleStatusUpdate} disabled={isUpdating || newStatus === editLinkclick?.status}>{isUpdating ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>) : ('Save Changes')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}