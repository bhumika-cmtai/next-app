"use client";

import React, { useState, ChangeEvent, useEffect, FormEvent } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Edit, Mail, Phone, PlusCircle } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { 
  fetchClients, 
  selectClients, 
  selectLoading, 
  selectPagination, 
  selectCurrentPage, 
  Client, 
  updateClient,
  setCurrentPage
} from "@/lib/redux/clientSlice";
import { AppDispatch } from "@/lib/store";
import { useSelector, useDispatch } from "react-redux";

export default function Clients() {
  const dispatch = useDispatch<AppDispatch>();

  // --- State for Client List Search (existing) ---
  const clients = useSelector(selectClients);
  const loading = useSelector(selectLoading);
  const pagination = useSelector(selectPagination);
  const currentPage = useSelector(selectCurrentPage);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedPortal, setSelectedPortal] = useState("");
  const [portalNames, setPortalNames] = useState<string[]>([]);
  const [portalsLoading, setPortalsLoading] = useState(true);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  // --- State for Single Client Search ---
  const [singleSearchNumber, setSingleSearchNumber] = useState("");
  const [singleClientResult, setSingleClientResult] = useState<Client | null>(null);
  const [isSingleClientLoading, setIsSingleClientLoading] = useState(false);
  const [singleClientError, setSingleClientError] = useState<string | null>(null);

  // --- State for Edit Modal ---
  const [modalOpen, setModalOpen] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formStatus, setFormStatus] = useState("New");
  const [formReason, setFormReason] = useState("");
  const [newOwnerName, setNewOwnerName] = useState("");
  const [newOwnerNumber, setNewOwnerNumber] = useState("");
  const [showAddOwnerForm, setShowAddOwnerForm] = useState(false);


  // Fetch portal names when the component mounts
  useEffect(() => {
    const fetchPortalNames = async () => {
      setPortalsLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/clients/getPortalNames`);
        if (response.data) setPortalNames(response.data.data);
      } catch (error) {
        console.error("Failed to fetch portal names:", error);
      } finally {
        setPortalsLoading(false);
      }
    };
    fetchPortalNames();
  }, []);

  // Fetch clients for the list when filters or page change
  useEffect(() => {
    if (searchTriggered) {
      dispatch(fetchClients({ phoneNumber, portalName: selectedPortal, status: statusFilter === 'all' ? undefined : statusFilter, page: currentPage }));
    }
  }, [dispatch, statusFilter, currentPage, searchTriggered, phoneNumber, selectedPortal]);

  // --- Handler for Single Client Search ---
  const handleGetClientSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!singleSearchNumber) {
      setSingleClientError("Please enter a client number to search.");
      return;
    }
    setIsSingleClientLoading(true);
    setSingleClientResult(null);
    setSingleClientError(null);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/clients/getAllClient?phoneNumber=${singleSearchNumber}`);
      const results = response.data.data.clients;
      if (results && results.length > 0) {
        setSingleClientResult(results[0]);
      } else {
        setSingleClientError("No client found with that phone number.");
      }
    } catch (error) {
      console.error("Failed to fetch single client:", error);
      setSingleClientError("An error occurred while searching for the client.");
    } finally {
      setIsSingleClientLoading(false);
    }
  };

  // --- Handlers for Client List Search ---
  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !selectedPortal) {
      alert("Please enter a mobile number and select a portal.");
      return;
    }
    setSearchTriggered(true);
    if (currentPage !== 1) {
      dispatch(setCurrentPage(1));
    } else {
      dispatch(fetchClients({ phoneNumber, portalName: selectedPortal, status: statusFilter, page: 1 }));
    }
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    if (currentPage !== 1) dispatch(setCurrentPage(1));
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= (pagination?.totalPages || 1) && page !== currentPage) {
       dispatch(setCurrentPage(page));
    }
  };

  // --- openEditModal resets the new owner form ---
  const openEditModal = (client: Client) => {
    setEditClient(client);
    setFormStatus(client.status);
    setFormReason(client.reason || "");
    // Reset new owner fields every time modal opens
    setNewOwnerName("");
    setNewOwnerNumber("");
    setShowAddOwnerForm(false); 
    setModalOpen(true);
  };

  // --- handleFormSubmit correctly handles the nested backend response ---
  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editClient?._id) return;
    
    setFormLoading(true);
    
    // Prepare payload, starting with status and reason
    const updatePayload: Partial<Client> = {
      status: formStatus,
    };

    // Logic for reason field
    if (formStatus === "Not Interested") {
      updatePayload.reason = formReason;
    } else if (editClient.status === "Not Interested" && formStatus !== "Not Interested") {
      updatePayload.reason = "";
    }

    // Logic to append new owner if added
    if (showAddOwnerForm && newOwnerName.trim() !== "" && newOwnerNumber.trim() !== "") {
        const existingNames = editClient.ownerName || [];
        const existingNumbers = editClient.ownerNumber || [];

        updatePayload.ownerName = [...existingNames, newOwnerName];
        updatePayload.ownerNumber = [...existingNumbers, newOwnerNumber];
    }
    
    const responseWrapper = await dispatch(updateClient(editClient._id, updatePayload));
    setFormLoading(false);

    // Check for the nested 'data' property in the response from the backend
    if (responseWrapper?.data) {
      setModalOpen(false);
      // Extract the actual updated client from the nested property
      const updatedClient = responseWrapper.data;

      // Refresh the single client view if it was the one being edited
      if (singleClientResult && singleClientResult._id === editClient._id) {
        setSingleClientResult(updatedClient);
      }
      // Always refetch the list to ensure it's up to date
      if (searchTriggered) {
        dispatch(fetchClients({ phoneNumber, portalName: selectedPortal, status: statusFilter, page: currentPage }));
      }
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
    <div className="w-full mx-auto mt-2 space-y-8">
      {/* --- Get Single Client Card --- */}
      <Card>
        <CardHeader><CardTitle>Get Client Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleGetClientSubmit} className="flex flex-col sm:flex-row items-center gap-4">
            <Input
              placeholder="Enter Client Mobile Number"
              value={singleSearchNumber}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSingleSearchNumber(e.target.value)}
              className="w-full sm:flex-1"
            />
            <Button type="submit" className="w-full sm:w-auto" disabled={isSingleClientLoading}>
              {isSingleClientLoading ? 'Searching...' : 'Search'}
            </Button>
          </form>
          {isSingleClientLoading && <p className="text-center mt-4">Loading...</p>}
          {singleClientError && <p className="text-center mt-4 text-red-500">{singleClientError}</p>}
        </CardContent>
      </Card>

      {/* --- Single Client Result Table --- */}
      {singleClientResult && (
        <Card>
          <CardHeader><CardTitle>Client Result</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Owner(s)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Portal</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow key={singleClientResult._id}>
                    <TableCell><div className="font-medium">{singleClientResult.name}</div></TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-500" /><span className="text-sm">{singleClientResult.email}</span></div>
                        <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-500" /><span className="text-sm">{singleClientResult.phoneNumber}</span></div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        {(singleClientResult.ownerName && singleClientResult.ownerName.length > 0) ? (
                            singleClientResult.ownerName.map((name, index) => (
                                <div key={index}>{name} - {singleClientResult.ownerNumber?.[index] || 'N/A'}</div>
                            ))
                        ) : 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell><Badge className={`${getStatusColor(singleClientResult.status || "")} text-white`}>{singleClientResult.status}</Badge></TableCell>
                    <TableCell>{singleClientResult.portalName}</TableCell>
                    <TableCell>
                      <Button size="icon" variant="ghost" onClick={() => openEditModal(singleClientResult)}><Edit className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* --- Search for Client List Card --- */}
      <Card>
        <CardHeader><CardTitle>Search for Client List</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-4">
            <Input
              placeholder="Enter Mobile Number"
              value={phoneNumber}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
              className="w-full sm:flex-1"
              required
            />
            <Select onValueChange={setSelectedPortal} value={selectedPortal} required>
              <SelectTrigger className="w-full sm:flex-1">
                <SelectValue placeholder={portalsLoading ? "Loading portals..." : "Select Portal"} />
              </SelectTrigger>
              <SelectContent>
                {portalNames.map(name => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" className="w-full sm:w-auto">Search</Button>
          </form>
        </CardContent>
      </Card>

      {/* --- Client List Results --- */}
      {searchTriggered && (
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <h1 className="text-3xl font-bold">Clients List</h1>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
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
                      <TableHead>Client</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Leader Code</TableHead>
                      <TableHead>Created</TableHead>
                      {/* <TableHead>Actions</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
                    ) : clients.length === 0 ? (
                      <TableRow><TableCell colSpan={6} className="text-center py-8">No clients found.</TableCell></TableRow>
                    ) : (
                      clients.map((client) => (
                        <TableRow key={client._id}>
                          <TableCell><div className="font-medium">{client.name}</div></TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-500" /><span className="text-sm">{client.email}</span></div>
                              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-500" /><span className="text-sm">{client.phoneNumber}</span></div>
                            </div>
                          </TableCell>
                          <TableCell><Badge className={`${getStatusColor(client.status || "")} text-white`}>{client.status}</Badge></TableCell>
                          <TableCell>{client.leaderCode}</TableCell>
                          <TableCell>{client.createdOn ? new Date(parseInt(client.createdOn)).toLocaleDateString() : '-'}</TableCell>
                          {/* <TableCell>
                            <div className="flex gap-2">
                              <Button size="icon" variant="ghost" onClick={() => openEditModal(client)}><Edit className="w-4 h-4" /></Button>
                            </div>
                          </TableCell> */}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          {pagination && pagination.totalPages > 1 && (
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
      )}

      {/* --- Edit Client Dialog --- */}
      <Dialog open={modalOpen} onOpenChange={(open) => { if (!open) { setModalOpen(false); setEditClient(null); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Client</DialogTitle></DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">

            {/* Display Existing Owners */}
            <div>
                <label className="text-sm font-medium">Existing Owner(s)</label>
                <div className="mt-2 p-3 border rounded-md bg-muted text-muted-foreground text-sm space-y-1">
                    {editClient?.ownerName && editClient.ownerName.length > 0 ? (
                        editClient.ownerName.map((name, index) => (
                            <div key={index}>{name} ({editClient.ownerNumber?.[index] || 'No number'})</div>
                        ))
                    ) : (
                        <p>No existing owners.</p>
                    )}
                </div>
            </div>
            
            {/* "Add Owner" Button */}
            {!showAddOwnerForm && (
                <Button type="button" variant="outline" className="w-full" onClick={() => setShowAddOwnerForm(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Owner
                </Button>
            )}

            {/* New Owner Input Fields */}
            {showAddOwnerForm && (
                <div className="space-y-2 border-t pt-4">
                    <label className="text-sm font-medium">New Owner Details</label>
                    <Input 
                        placeholder="New Owner Name" 
                        value={newOwnerName} 
                        onChange={(e) => setNewOwnerName(e.target.value)}
                        required
                    />
                    <Input 
                        placeholder="New Owner Phone Number" 
                        value={newOwnerNumber} 
                        onChange={(e) => setNewOwnerNumber(e.target.value)}
                        required
                    />
                </div>
            )}
            
            {/* Status Dropdown */}
            <Select value={formStatus} onValueChange={setFormStatus}>
              <SelectTrigger>
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

            {/* Reason Input */}
            {formStatus === 'Not Interested' && (
              <Input 
                placeholder="Reason for not being interested" 
                value={formReason} 
                onChange={(e) => setFormReason(e.target.value)} 
              />
            )}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)} disabled={formLoading}>Cancel</Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? 'Saving...' : 'Done'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}