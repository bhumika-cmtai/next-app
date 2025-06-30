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
import { Edit, Mail, Phone, PlusCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import { 
  updateClient,
  Client, 
  fetchPortalNames, // Import the new thunk
  selectPortalNames // Import the new selector
} from "@/lib/redux/clientSlice";
import { fetchSession, GlobalSession } from "@/lib/redux/authSlice";
import { AppDispatch } from "@/lib/store";
import { useSelector, useDispatch } from "react-redux";

// Helper function for time comparison (remains the same)
const isCurrentTimeInSession = (session: GlobalSession | null): boolean => {
  if (!session?.sessionStartDate || !session.sessionStartTime || !session.sessionEndDate || !session.sessionEndTime) {
    return false;
  }
  const now = new Date();
  const startDateTime = new Date(`${session.sessionStartDate.split('T')[0]}T${session.sessionStartTime}:00`);
  const endDateTime = new Date(`${session.sessionEndDate.split('T')[0]}T${session.sessionEndTime}:00`);
  return now >= startDateTime && now <= endDateTime;
};

export default function Clients() {
  const dispatch = useDispatch<AppDispatch>();

  // --- Redux State ---
  const portalNames = useSelector(selectPortalNames);

  // --- Single Client Search State ---
  const [singleSearchNumber, setSingleSearchNumber] = useState("");
  const [singleSearchPortal, setSingleSearchPortal] = useState("");
  const [singleClientResult, setSingleClientResult] = useState<Client | null>(null);
  const [isSingleClientLoading, setIsSingleClientLoading] = useState(false);
  const [singleClientError, setSingleClientError] = useState<string | null>(null);
  
  // --- Global Session State ---
  const [globalSession, setGlobalSession] = useState<GlobalSession | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isSessionCheckLoading, setIsSessionCheckLoading] = useState(true);

  // --- Edit Modal State ---
  const [modalOpen, setModalOpen] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formStatus, setFormStatus] = useState("New");
  const [formReason, setFormReason] = useState("");
  const [newOwnerName, setNewOwnerName] = useState("");
  const [newOwnerNumber, setNewOwnerNumber] = useState("");
  const [showAddOwnerForm, setShowAddOwnerForm] = useState(false);

  // --- Fetch Initial Data (Portals & Session) on Mount ---
  useEffect(() => {
    // Fetch Portals via Redux
    dispatch(fetchPortalNames());

    // Fetch and Check Global Session
    const checkSession = async () => {
      setIsSessionCheckLoading(true);
      try {
        const session: GlobalSession | null = await dispatch(fetchSession());
        setGlobalSession(session);
        setIsSessionActive(isCurrentTimeInSession(session));
      } catch (error) {
        console.error("Failed to fetch global session:", error);
        setIsSessionActive(false);
      } finally {
        setIsSessionCheckLoading(false);
      }
    };
    checkSession();
  }, [dispatch]);

  // --- Handler for Single Client Search ---
  const handleGetClientSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!singleSearchNumber || !singleSearchPortal) {
      setSingleClientError("Please select a portal and enter a client number.");
      return;
    }
    setIsSingleClientLoading(true);
    setSingleClientResult(null);
    setSingleClientError(null);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/clients/getAllClient?portalName=${singleSearchPortal}&phoneNumber=${singleSearchNumber}`);
      const results = response.data.data.clients;
      if (results && results.length > 0) {
        setSingleClientResult(results[0]);
      } else {
        setSingleClientError("No client found with that combination of portal and phone number.");
      }
    } catch (error) {
      console.error("Failed to fetch single client:", error);
      setSingleClientError("An error occurred while searching for the client.");
    } finally {
      setIsSingleClientLoading(false);
    }
  };

  const openEditModal = (client: Client) => {
    setEditClient(client);
    setFormStatus(client.status);
    setFormReason(client.reason || "");
    setNewOwnerName("");
    setNewOwnerNumber("");
    setShowAddOwnerForm(false); 
    setModalOpen(true);
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editClient?._id) return;
    setFormLoading(true);
    
    const updatePayload: Partial<Client> = { status: formStatus };
    if (formStatus === "Not Interested") { updatePayload.reason = formReason; }
    else if (editClient.status === "Not Interested") { updatePayload.reason = ""; }

    if (showAddOwnerForm && newOwnerName.trim() && newOwnerNumber.trim()) {
      updatePayload.ownerName = [...(editClient.ownerName || []), newOwnerName];
      updatePayload.ownerNumber = [...(editClient.ownerNumber || []), newOwnerNumber];
    }
    
    const responseWrapper = await dispatch(updateClient(editClient._id, updatePayload));
    setFormLoading(false);

    if (responseWrapper?.data) {
      setModalOpen(false);
      if (singleClientResult?._id === editClient._id) {
        setSingleClientResult(responseWrapper.data);
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
      <Card>
        <CardHeader><CardTitle>Get Client Details</CardTitle></CardHeader>
        <CardContent>
          <div className={`p-3 mb-4 rounded-md text-sm flex items-center gap-2 ${isSessionCheckLoading ? 'bg-blue-50 text-blue-800' : isSessionActive ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {isSessionCheckLoading ? (<><Clock className="w-4 h-4 animate-spin"/> Checking session...</>) : isSessionActive ? (<><Clock className="w-4 h-4"/> Session is active. You can claim clients.</>) : (<><AlertCircle className="w-4 h-4"/> Session is not active. Client claiming is disabled.</>)}
          </div>
          
          <form onSubmit={handleGetClientSubmit} className="flex flex-col sm:flex-row items-center gap-4">
            <Select onValueChange={setSingleSearchPortal} value={singleSearchPortal}>
              <SelectTrigger className="w-full sm:flex-1" disabled={!isSessionActive}>
                <SelectValue placeholder="Select Portal" />
              </SelectTrigger>
              <SelectContent>
                {portalNames.length === 0 && <div className="p-2 text-sm text-muted-foreground">Loading portals...</div>}
                {portalNames.map(name => (<SelectItem key={name} value={name}>{name}</SelectItem>))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Enter Client Mobile Number"
              value={singleSearchNumber}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSingleSearchNumber(e.target.value)}
              className="w-full sm:flex-1"
              disabled={!isSessionActive}
            />
            <Button 
              type="submit" 
              className="w-full sm:w-auto" 
              disabled={!isSessionActive || isSingleClientLoading || isSessionCheckLoading || !singleSearchPortal || !singleSearchNumber}
            >
              {isSingleClientLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Search'}
            </Button>
          </form>
          {singleClientError && <p className="text-center mt-4 text-red-500">{singleClientError}</p>}
        </CardContent>
      </Card>

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
                        <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-500"/><span className="text-sm">{singleClientResult.email || '-'}</span></div>
                        <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-500"/><span className="text-sm">{singleClientResult.phoneNumber}</span></div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        {(singleClientResult.ownerName && singleClientResult.ownerName.length > 0) ? (singleClientResult.ownerName.map((name, index) => (<div key={index}>{name} - {singleClientResult.ownerNumber?.[index] || 'N/A'}</div>))) : 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell><Badge className={`${getStatusColor(singleClientResult.status || "")} text-white`}>{singleClientResult.status}</Badge></TableCell>
                    <TableCell>{singleClientResult.portalName}</TableCell>
                    <TableCell>
                      <Button size="icon" variant="ghost" onClick={() => openEditModal(singleClientResult)}><Edit className="w-4 h-4"/></Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Client</DialogTitle></DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">
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
            
            {!showAddOwnerForm && (
                <Button type="button" variant="outline" className="w-full" onClick={() => setShowAddOwnerForm(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Owner
                </Button>
            )}

            {showAddOwnerForm && (
                <div className="space-y-2 border-t pt-4">
                    <label className="text-sm font-medium">New Owner Details</label>
                    <Input placeholder="New Owner Name" value={newOwnerName} onChange={(e) => setNewOwnerName(e.target.value)} required/>
                    <Input placeholder="New Owner Phone Number" value={newOwnerNumber} onChange={(e) => setNewOwnerNumber(e.target.value)} required/>
                </div>
            )}
            
            <Select value={formStatus} onValueChange={setFormStatus}>
              <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Interested">Interested</SelectItem>
                <SelectItem value="Not Interested">Not Interested</SelectItem>
                <SelectItem value="Converted">Converted</SelectItem>
              </SelectContent>
            </Select>

            {formStatus === 'Not Interested' && (
              <Input placeholder="Reason for not being interested" value={formReason} onChange={(e) => setFormReason(e.target.value)}/>
            )}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)} disabled={formLoading}>Cancel</Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : null}
                {formLoading ? 'Saving...' : 'Done'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}