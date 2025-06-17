"use client";

import React, { useState, useMemo, ChangeEvent } from "react";
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
import { Plus, Upload, Edit, Trash2, Phone, Mail } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import ImportLeads from "./importLeads";

// Temporary data structure until we implement Redux
interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  notes: string;
  createdAt: string;
}

type LeadStatus = typeof LEAD_STATUS[keyof typeof LEAD_STATUS];
type LeadSource = typeof LEAD_SOURCES[keyof typeof LEAD_SOURCES];

const LEAD_STATUS = {
  NEW: "New",
  CONTACTED: "Contacted",
  INTERESTED: "Interested",
  NOT_INTERESTED: "Not Interested",
  CONVERTED: "Converted",
} as const;

const LEAD_SOURCES = {
  WEBSITE: "Website",
  REFERRAL: "Referral",
  SOCIAL: "Social Media",
  OTHER: "Other",
} as const;

// Dummy data
const dummyLeads: Lead[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    source: LEAD_SOURCES.WEBSITE,
    status: LEAD_STATUS.NEW,
    notes: "Interested in premium package",
    createdAt: "2024-03-20",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1987654321",
    source: LEAD_SOURCES.REFERRAL,
    status: LEAD_STATUS.INTERESTED,
    notes: "Follow up next week",
    createdAt: "2024-03-19",
  },
];

export default function Leads() {
  const [leads] = useState<Lead[]>(dummyLeads);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [form, setForm] = useState<Omit<Lead, 'id' | 'createdAt'>>({
    name: "",
    email: "",
    phone: "",
    source: LEAD_SOURCES.WEBSITE,
    status: LEAD_STATUS.NEW,
    notes: "",
  });

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(search.toLowerCase()) &&
        (!statusFilter ? true : lead.status === statusFilter)
    );
  }, [leads, search, statusFilter]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case LEAD_STATUS.NEW:
        return "bg-blue-500";
      case LEAD_STATUS.CONTACTED:
        return "bg-yellow-500";
      case LEAD_STATUS.INTERESTED:
        return "bg-green-500";
      case LEAD_STATUS.NOT_INTERESTED:
        return "bg-red-500";
      case LEAD_STATUS.CONVERTED:
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleImportSuccess = () => {
    // Here you would refresh the leads list
    console.log("Leads imported successfully");
  };

  return (
    <div className="w-full mx-auto mt-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">User List</h1>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className="w-full sm:w-48"
          />
          <Select 
            value={statusFilter} 
            onValueChange={(value: LeadStatus) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Contacted">Contacted</SelectItem>
              <SelectItem value="Not Interested">Not Interested</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="default" size="sm" className="gap-1" onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" /> Add Lead
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={() => setImportModalOpen(true)}
          >
            <Upload className="w-4 h-4" /> Import
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
                  <TableHead>Lead</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead, idx) => (
                  <TableRow key={lead.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium">{lead.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{lead.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{lead.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{lead.source}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(lead.status) + " text-white"}>
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate text-sm text-gray-600">
                        {lead.notes}
                      </div>
                    </TableCell>
                    <TableCell>{lead.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setEditLead(lead);
                            setForm(lead);
                            setModalOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Lead Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editLead ? 'Edit Lead' : 'Add Lead'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4 mt-2">
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
            <Select 
              value={form.source} 
              onValueChange={(value: LeadSource) => setForm({ ...form, source: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Source" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(LEAD_SOURCES).map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select 
              value={form.status} 
              onValueChange={(value: LeadStatus) => setForm({ ...form, status: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(LEAD_STATUS).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <textarea
              className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background"
              placeholder="Notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
            <DialogFooter>
              <Button type="submit">
                {editLead ? 'Update' : 'Add'} Lead
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Import Leads Dialog */}
      <ImportLeads 
        open={importModalOpen}
        onOpenChange={setImportModalOpen}
        onImportSuccess={handleImportSuccess}
      />

      {/* Pagination */}
      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
