"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
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
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, Edit, Trash2, Search, Loader2, Download, Eye, CheckSquare, Square } from "lucide-react"; // Added CheckSquare, Square icons
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, selectUsers, selectLoading, User, selectPagination, selectCurrentPage,addUser,updateUser,deleteUser as deleteUserAction, deleteManyUsers } from "@/lib/redux/userSlice";
import { AppDispatch } from "@/lib/store";
import ImportUser from "./importUser";
import { generatePassword } from "./passwordGenerator";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; // Added for export notifications
import { DeleteConfirmationModal } from "@/app/components/ui/delete-confirmation-modal";

// Define the initial state for our expanded form
const initialFormState: Omit<User, 'role' | '_id' | 'password' | 'createdOn' | 'updatedOn' | 'registeredClientCount' > = {
  name: "",
  email: "",
  phoneNumber: "",
  whatsappNumber: "",
  city: "",
  status: "New",
  leaderCode: "",
  income: 0
};

export default function Users() {
  const dispatch = useDispatch<AppDispatch>();
  const users: User[] = useSelector(selectUsers);
  const loading: boolean = useSelector(selectLoading);
  const pagination = useSelector(selectPagination);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState(initialFormState);
  const [formLoading, setFormLoading] = useState(false);
  
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // State for the "View Details" modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  // State for Import Modal
  const [importModalOpen, setImportModalOpen] = useState(false);

  // State for Export Modal
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportStatus, setExportStatus] = useState("all");
  
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [dateRangeCount, setDateRangeCount] = useState<number | null>(null);
  const [isCountLoading, setIsCountLoading] = useState<boolean>(false);
  const [countError, setCountError] = useState<string | null>(null);

  // State for multiple selection
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const ITEMS_PER_PAGE = 8;

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch users on mount and when filters change
  useEffect(() => {
    const params = {
      search: debouncedSearch,
      status: status === "all" ? undefined : status,
      page: 1,
      limit: 10000 // Large limit to get all records
    };

    dispatch(fetchUsers(params));
  }, [dispatch, debouncedSearch, status]);

  // Calculate pagination on the client side
  const displayedUsers = users;
  const totalItems = displayedUsers.length;
  const totalPaginatedPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  
  // Get current page's data
  const currentPageData = displayedUsers.slice(
    (page - 1) * ITEMS_PER_PAGE, 
    page * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPaginatedPages) return;
    setPage(newPage);
    // Smooth scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    setPage(1); // Reset to page 1 on filter change
  };

  const openAddModal = () => {
    setEditUser(null);
    setForm(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditUser(user);
    setForm({
      name: user.name ?? '',
      email: user.email ?? '',
      phoneNumber: user.phoneNumber ?? '',
      whatsappNumber: user.whatsappNumber ?? '',
      city: user.city ?? '',
      status: user.status ?? 'New',
      leaderCode: user.leaderCode ?? '',
      income: user.income ?? 0
    });
    setIsModalOpen(true);
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prevForm => ({...prevForm, [name]: name === 'income' ? (value === '' ? 0 : Number(value)) : value}));
  };
  
  const handleFormSelectChange = (fieldName: string, value: string) => {
    setForm({ ...form, [fieldName]: value });
  };
  
  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      let response;
      if (editUser && editUser._id) {
        const updatedUserPayload = { ...editUser, ...form, income: Number(form.income) || 0 };
        response = await dispatch(updateUser(editUser._id, updatedUserPayload));
      } else {
        const generatedPassword = generatePassword(form.name, form.phoneNumber);
        const newUserPayload: User = {
          ...form,
          income: Number(form.income) || 0,
          role: "user",
          password: generatedPassword,
        };
        response = await dispatch(addUser(newUserPayload));
      }

      if (response) {
        setIsModalOpen(false);
        dispatch(fetchUsers({ search: debouncedSearch, status, page: page }));
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteUser?._id) return;
    setDeleteLoading(true);
    try {
      await dispatch(deleteUserAction(deleteUser._id));
      setDeleteUser(null);
      const newPage = users.length === 1 && page > 1 ? page - 1 : page;
      dispatch(fetchUsers({ search: debouncedSearch, status, page: newPage }));
    } finally {
      setDeleteLoading(false);
    }
  };

  // Function to handle the CSV export
  const handleExport = async () => {
    let allUsers: User[] = [];
    try {
      // Fetch all users matching current filters (not just current page)
      const params: any = {
        search: debouncedSearch,
        page: 1,
        limit: 10000, // Large limit to get all records
        status: exportStatus !== "all" ? exportStatus : undefined
      };

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/getAllUsers`, { params });
      allUsers = response.data?.data?.users || [];

      if (!allUsers || allUsers.length === 0) {
        toast.warning("No users found to export.");
        return;
      }

      toast.success(`Found ${allUsers.length} users to export.`);

      const headers = ["Name", "Email", "Phone Number", "WhatsApp Number", "City", "Status", "Leader Code", "Income", "Registered Clients", "Joined On", "Account Number", "IFSC", "UPI ID"];
      const csvContent = [
        headers.join(","),
        ...allUsers.map((user: User) => [
          `"${(user.name || '').replace(/"/g, '""')}"`,
          `"${(user.email || '').replace(/"/g, '""')}"`,
          `"${user.phoneNumber || ''}"`,
          `"${user.whatsappNumber || ''}"`,
          `"${(user.city || '').replace(/"/g, '""')}"`,
          `"${user.status || 'N/A'}"`,
          `"${user.leaderCode || 'N/A'}"`,
          `${user.income || 0}`,
          `${user.registeredClientCount || 0}`,
          `"${user.createdOn ? new Date(parseInt(user.createdOn)).toLocaleDateString() : 'N/A'}"`,
          `"${user.account_number || 'N/A'}"`,
          `"${user.Ifsc || 'N/A'}"`,
          `"${user.upi_id || 'N/A'}"`
        ].join(","))
      ].join("\n");
    
      const blob = new Blob([`\uFEFF${csvContent}`], { type: "text/csv;charset=utf-8;" }); // Add BOM for Excel compatibility
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `users-${exportStatus.toLowerCase()}-${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Clean up the URL object
    
      setExportModalOpen(false);
      toast.success(`Successfully exported ${allUsers.length} users.`);
    } catch (err) {
      console.error('Export error:', err);
      toast.error("Failed to export users data. Please try again.");
    }
  };
  
  const handleDateRangeSearch = async () => {
    if (!startDate || !endDate) return;
    setIsCountLoading(true);
    setCountError(null);
    setDateRangeCount(null);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/registers/getRegistersCountByDate`, { startDate, endDate });
      setDateRangeCount(response.data?.data?.count ?? 0);
    } catch (error: any) {
      setCountError(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsCountLoading(false);
    }
  };

  // NEW: Handler for selecting/deselecting a single user
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // NEW: Handler for selecting/deselecting all users
  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user._id || '').filter(Boolean));
    }
  };

  // NEW: Handler for bulk delete action
  const handleBulkDelete = () => {
    if (selectedUsers.length === 0) {
      toast.warning("No leaders selected for deletion");
      return;
    }
    setIsBulkDeleteModalOpen(true);
  };

  // NEW: Handler to confirm bulk deletion
  const confirmBulkDelete = async () => {
    const result = await dispatch(deleteManyUsers(selectedUsers));
    if (result) {
      toast.success(`${selectedUsers.length} leaders deleted successfully`);
      setIsBulkDeleteModalOpen(false);
      setSelectedUsers([]);
      dispatch(fetchUsers({ search: debouncedSearch, status, page: page }));
    } else {
      toast.error("Failed to delete leaders");
    }
  };

  const openDeleteModal = (user: User) => {
    setDeleteUser(user);
    setIsDeleteModalOpen(true);
  };

  const openViewModal = (user: User) => {
    setViewingUser(user);
    setIsViewModalOpen(true);
  };

  return (
    <div className="w-full mx-auto mt-2">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
        <h1 className="text-4xl font-bold shrink-0">Leader List</h1>
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-wrap justify-end gap-2">
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-grow sm:flex-grow-0 sm:w-48"/>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full sm:w-32"><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" className="gap-1" onClick={openAddModal}><Plus className="w-4 h-4"/> Add Leader</Button>
            <Button variant="outline" size="sm" className="gap-1" onClick={() => setImportModalOpen(true)}><Upload className="w-4 h-4"/> Import</Button>
            <Button variant="outline" size="sm" className="gap-1" onClick={() => setExportModalOpen(true)}><Download className="w-4 h-4"/> Export</Button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center items-end gap-2 p-4 border rounded-lg bg-slate-50">
        <div className="space-y-1"><Label htmlFor="start-date" className="text-sm font-medium">Start Date</Label><Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}/></div>
        <div className="space-y-1"><Label htmlFor="end-date" className="text-sm font-medium">End Date</Label><Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}/></div>
        <Button onClick={handleDateRangeSearch} disabled={isCountLoading} className="gap-1"><Search className="w-4 h-4"/>{isCountLoading ? 'Searching...':'Search Dates'}</Button>
      </div>

      <div className="mb-4 h-6">
        {countError && <p className="text-red-500 font-medium">{countError}</p>}
        {dateRangeCount !== null && (<p className="text-lg font-semibold text-primary">Total Registrations Found: {dateRangeCount}</p>)}
      </div>

      {/* NEW: Bulk Actions Bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1.5" 
            onClick={toggleSelectAll}
          >
            {selectedUsers.length === users.length && users.length > 0 ? (
              <CheckSquare className="h-4 w-4" />
            ) : (
              <Square className="h-4 w-4" />
            )}
            {selectedUsers.length > 0 ? `Selected (${selectedUsers.length})` : "Select All"}
          </Button>
        </div>
        {selectedUsers.length > 0 && (
          <Button 
            variant="destructive" 
            size="sm" 
            className="flex items-center gap-1.5"
            onClick={handleBulkDelete}
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <div className="flex items-center justify-center">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5" 
                        onClick={toggleSelectAll}
                      >
                        {selectedUsers.length === users.length && users.length > 0 ? (
                          <CheckSquare className="h-4 w-4" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableHead>
                  <TableHead className="w-12">S. No.</TableHead>
                  <TableHead>Leader Name</TableHead>
                  <TableHead>Leader Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Leader Code</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Total Registration</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={9} className="text-center py-8"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></TableCell></TableRow>
                ) : currentPageData.length === 0 ? (
                  <TableRow><TableCell colSpan={9} className="text-center py-8">No Leaders found.</TableCell></TableRow>
                ) : (
                  currentPageData.map((user: User, idx: number) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-5 w-5" 
                            onClick={() => toggleUserSelection(user._id || '')}
                          >
                            {selectedUsers.includes(user._id || '') ? (
                              <CheckSquare className="h-4 w-4" />
                            ) : (
                              <Square className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{(page - 1) * ITEMS_PER_PAGE + idx + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar><AvatarFallback>{user.name?.[0]?.toUpperCase()}</AvatarFallback></Avatar>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.phoneNumber || '-'}</TableCell>
                      <TableCell><Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status || 'N/A'}</Badge></TableCell>
                      <TableCell>{user.leaderCode || '-'}</TableCell>
                      <TableCell>{user.createdOn ? new Date(parseInt(user.createdOn)).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>{user.registeredClientCount}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost" onClick={() => openViewModal(user)} title="View">
                            <Eye className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => openEditModal(user)} title="Edit"><Edit className="w-4 h-4" /></Button>
                          <Button size="icon" variant="ghost" onClick={() => openDeleteModal(user)} title="Delete">
                            <Trash2 className="w-4 h-4 text-red-500" />
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

      {/* Update pagination */}
      {totalPaginatedPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem className={page === 1 ? "pointer-events-none opacity-50" : ""}>
                <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(page - 1); }} />
              </PaginationItem>
              
              {/* First page */}
              {page > 3 && (
                <PaginationItem>
                  <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(1); }}>
                    1
                  </PaginationLink>
                </PaginationItem>
              )}
              
              {/* Ellipsis if needed */}
              {page > 4 && (
                <PaginationItem>
                  <span className="px-2">...</span>
                </PaginationItem>
              )}
              
              {/* Pages around current page */}
              {Array.from({ length: totalPaginatedPages }, (_, i) => i + 1)
                .filter(pageNum => pageNum >= Math.max(1, page - 1) && pageNum <= Math.min(totalPaginatedPages, page + 1))
                .map(pageNum => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink 
                      href="#" 
                      isActive={page === pageNum}
                      onClick={(e) => { e.preventDefault(); handlePageChange(pageNum); }}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ))
              }
              
              {/* Ellipsis if needed */}
              {page < totalPaginatedPages - 3 && (
                <PaginationItem>
                  <span className="px-2">...</span>
                </PaginationItem>
              )}
              
              {/* Last page */}
              {page < totalPaginatedPages - 2 && (
                <PaginationItem>
                  <PaginationLink 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); handlePageChange(totalPaginatedPages); }}
                  >
                    {totalPaginatedPages}
                  </PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem className={page === totalPaginatedPages ? "pointer-events-none opacity-50" : ""}>
                <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(page + 1); }} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Add/Edit Dialog remains the same */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editUser ? 'Edit Leader' : 'Add New Leader'}</DialogTitle>
            <DialogDescription>
              {editUser ? 'Update the details for this leader.' : 'Fill in the details for the new leader. Name and phone are required.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4 mt-2 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="name">Name*</Label><Input id="name" name="name" value={form.name} onChange={handleFormChange} required /></div>
              <div className="space-y-2"><Label htmlFor="email">Email*</Label><Input id="email" name="email" type="email" value={form.email} onChange={handleFormChange} required/></div>
              <div className="space-y-2"><Label htmlFor="phoneNumber">Phone Number*</Label><Input id="phoneNumber" name="phoneNumber" value={form.phoneNumber} onChange={handleFormChange} required /></div>
              <div className="space-y-2"><Label htmlFor="whatsappNumber">WhatsApp Number</Label><Input id="whatsappNumber" name="whatsappNumber" value={form.whatsappNumber} onChange={handleFormChange}/></div>
              <div className="space-y-2"><Label htmlFor="city">City</Label><Input id="city" name="city" value={form.city} onChange={handleFormChange}/></div>
              <div className="space-y-2"><Label htmlFor="income">Income</Label><Input id="income" name="income" type="number" value={form.income || ''} onChange={handleFormChange}/></div>
              <div className="space-y-2"><Label htmlFor="leaderCode">Leader Code</Label><Input id="leaderCode" name="leaderCode" value={form.leaderCode} onChange={handleFormChange}/></div>
              <div className="space-y-2"><Label htmlFor="status">Status</Label><Select value={form.status} onValueChange={(value) => handleFormSelectChange('status', value)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="New">New</SelectItem><SelectItem value="Active">Active</SelectItem><SelectItem value="Inactive">Inactive</SelectItem></SelectContent></Select></div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline" disabled={formLoading}>Cancel</Button></DialogClose>
              <Button type="submit" disabled={formLoading}>{formLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}{formLoading ? 'Saving...' : (editUser ? 'Update Leader' : 'Add Leader')}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
        {/* NEW: View Details Dialog */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Leader Details</DialogTitle>
            <DialogDescription>
              Viewing the complete information for {viewingUser?.name}.
            </DialogDescription>
          </DialogHeader>
          {viewingUser && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 py-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-1">
                <Label className="text-muted-foreground">Name</Label>
                <p className="font-medium">{viewingUser.name}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{viewingUser.email}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Phone Number</Label>
                <p className="font-medium">{viewingUser.phoneNumber}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">WhatsApp Number</Label>
                <p className="font-medium">{viewingUser.whatsappNumber || "-"}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">City</Label>
                <p className="font-medium">{viewingUser.city || "-"}</p>
              </div>
               <div className="space-y-1">
                <Label className="text-muted-foreground">Status</Label>
                <p><Badge variant={viewingUser.status === "Active" ? "default" : "secondary"}>{viewingUser.status || 'N/A'}</Badge></p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Leader Code</Label>
                <p className="font-medium">{viewingUser.leaderCode || "-"}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Income</Label>
                <p className="font-medium">₹{viewingUser.income?.toLocaleString() || 0}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Account Number</Label>
                <p className="font-medium">{viewingUser.account_number || '-'}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Ifsc</Label>
                <p className="font-medium">{viewingUser.Ifsc || '-'}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">upi_id</Label>
                <p className="font-medium">{viewingUser.upi_id || '-'}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Joined On</Label>
                <p className="font-medium">
                  {viewingUser.createdOn ? new Date(parseInt(viewingUser.createdOn)).toLocaleString() : '-'}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>



      {/* Export Dialog */}
      <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Export Leaders</DialogTitle>
            <DialogDescription>
              Choose a status to filter leaders for export, or export all.
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
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
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
      
      <ImportUser open={importModalOpen} onOpenChange={setImportModalOpen} onImportSuccess={() => dispatch(fetchUsers())} />

      {/* Replace existing Delete Dialog with DeleteConfirmationModal */}
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Leader"
        description={`Are you sure you want to delete the leader "${deleteUser?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        isDeleting={deleteLoading}
        confirmButtonText="Delete Leader"
      />
      
      {/* NEW: Bulk Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={isBulkDeleteModalOpen}
        onOpenChange={setIsBulkDeleteModalOpen}
        title="Delete Multiple Leaders"
        description={`Are you sure you want to delete ${selectedUsers.length} selected leaders? This action cannot be undone.`}
        onConfirm={confirmBulkDelete}
        confirmButtonText="Delete"
        itemCount={selectedUsers.length}
      />
    </div>
  );
}