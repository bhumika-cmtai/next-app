"use client";

import React, { useState, useMemo } from "react";
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
import { Phone, Mail, Loader2 } from "lucide-react";

// Types from leads page
const LEAD_STATUS = {
  NEW: "New",
  CONTACTED: "Contacted",
} as const;

type LeadStatus = typeof LEAD_STATUS[keyof typeof LEAD_STATUS];

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
}

// Dummy data
const dummyContacts: Contact[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    status: LEAD_STATUS.NEW,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1987654321",
    status: LEAD_STATUS.CONTACTED,
  },
];

export default function Contacts() {
  const [contacts] = useState<Contact[]>(dummyContacts);
  const [search, setSearch] = useState("");
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filtered contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) =>
      contact.name.toLowerCase().includes(search.toLowerCase()) ||
      contact.email.toLowerCase().includes(search.toLowerCase()) ||
      contact.phone.includes(search)
    );
  }, [contacts, search]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case LEAD_STATUS.NEW:
        return "bg-blue-500";
      case LEAD_STATUS.CONTACTED:
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleStatusUpdate = async (status: LeadStatus) => {
    setIsLoading(true);
    try {
      // Here you would update the contact's status
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      console.log('Updating status for contact:', editContact?.id, 'to:', status);
      setModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto mt-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Contacts</h1>
        <div className="flex flex-col sm:flex-row gap-4">
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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact, idx) => (
                  <TableRow key={contact.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium">{contact.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{contact.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{contact.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(contact.status) + " text-white"}>
                        {contact.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditContact(contact);
                          setModalOpen(true);
                        }}
                      >
                        Update Status
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Update Status Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Contact Status</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Select
              value={editContact?.status}
              onValueChange={(value: LeadStatus) => handleStatusUpdate(value)}
              disabled={isLoading}
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
          </div>
          <DialogFooter className="flex gap-2">
            <Button 
              type="button"
              onClick={() => handleStatusUpdate(editContact?.status as LeadStatus)}
              disabled={isLoading || !editContact?.status}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
