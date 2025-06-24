'use client';

import { useState } from 'react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils'; 

interface Lead {
  id: number;
  name: string;
  phoneNumber: string;
  status: 'New' | 'Interested' | 'Not Interested';
  reason?: string;
}

const initialLeads: Lead[] = [
  { id: 1, name: 'Alice Johnson', phoneNumber: '555-0101', status: 'New' },
  { id: 2, name: 'Bob Williams', phoneNumber: '555-0102', status: 'New' },
  { id: 3, name: 'Charlie Brown', phoneNumber: '555-0103', status: 'New' },
];

type Status = 'Interested' | 'Not Interested';

const TeamsPage = () => {
  const [identityConfirmed, setIdentityConfirmed] = useState(false);

  const [showLeadsTable, setShowLeadsTable] = useState(false);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  
  const [editingLeadId, setEditingLeadId] = useState<number | null>(null);
  const [notInterestedReason, setNotInterestedReason] = useState('');
  const [showReasonInput, setShowReasonInput] = useState(false);

  const handleConfirmIdentity = () => {
    setIdentityConfirmed(true);
    setTimeout(() => setIdentityConfirmed(false), 3000);
  };

  const handleGetLeads = () => {
    setShowLeadsTable(true);
  };

  const handleEditClick = (leadId: number) => {
    setEditingLeadId(leadId);
    setNotInterestedReason('');
    setShowReasonInput(false);
  };

  const handleStatusChange = (leadId: number, newStatus: Status) => {
    if (newStatus === 'Interested') {
      setLeads(leads.map(lead => 
        lead.id === leadId ? { ...lead, status: 'Interested' } : lead
      ));
      setEditingLeadId(null);
    } else if (newStatus === 'Not Interested') {
      setShowReasonInput(true);
    }
  };
  
  const handleDoneClick = (leadId: number) => {
    if (notInterestedReason.trim() === '') {
      alert('Please provide a reason.');
      return;
    }
    setLeads(leads.map(lead => 
      lead.id === leadId 
        ? { ...lead, status: 'Not Interested', reason: notInterestedReason } 
        : lead
    ));
    setEditingLeadId(null);
  };

  const getBadgeVariant = (status: Lead['status']) => {
    switch (status) {
      case 'Interested':
        return 'default';
      case 'Not Interested':
        return 'destructive';
      case 'New':
      default:
        return 'secondary';
    }
  };

  return (
    <main className="min-h-screen bg-gray-700/80 p-10">
      
      <div className="w-full max-w-2xl mx-auto space-y-8">
        
        <div className="flex flex-col gap-8">
          
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center font-bold">User Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Input type="text" placeholder="Enter Mobile Number" />
                <Button onClick={handleConfirmIdentity} className="w-full sm:w-auto">Confirm Identity</Button>
              </div>
              {identityConfirmed && (
                <p className="text-center text-green-600 font-medium mt-4">Identity Confirmed</p>
              )}
            </CardContent>
          </Card>

          {/* Card 2: Get Leads */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center font-bold">Get Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Input type="text" placeholder="Enter Phone Number" />
                <Button onClick={handleGetLeads} className="w-full sm:w-auto">Get Lead</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {showLeadsTable && (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell>{lead.phoneNumber}</TableCell>
                        <TableCell>
                          <Badge variant={getBadgeVariant(lead.status)} className={cn(lead.status === 'Interested' && 'bg-green-500 hover:bg-green-600')}>
                            {lead.status}
                          </Badge>
                          {lead.status === 'Not Interested' && lead.reason && (
                            <p className="text-xs text-muted-foreground mt-1">Reason: {lead.reason}</p>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {editingLeadId === lead.id ? (
                            <div className="flex flex-col items-end gap-2 min-w-[240px]">
                              <Select onValueChange={(value: Status) => handleStatusChange(lead.id, value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Interested">Interested</SelectItem>
                                  <SelectItem value="Not Interested">Not Interested</SelectItem>
                                </SelectContent>
                              </Select>
                              {showReasonInput && (
                                <div className="flex w-full items-center gap-2">
                                  <Input type="text" placeholder="Enter reason" value={notInterestedReason} onChange={(e) => setNotInterestedReason(e.target.value)} />
                                  <Button onClick={() => handleDoneClick(lead.id)} size="sm">Done</Button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <Button variant="outline" size="sm" onClick={() => handleEditClick(lead.id)}>Edit Status</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
};

export default TeamsPage;