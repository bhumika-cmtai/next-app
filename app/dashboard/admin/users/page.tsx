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
import { Plus, Upload, Edit, Trash2, Search, Loader2 } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, selectUsers, selectLoading, User, selectPagination, selectCurrentPage,addUser,updateUser,deleteUser as deleteUserAction, } from "@/lib/redux/userSlice";
import { AppDispatch } from "@/lib/store";
import ImportUser from "./importUser";
import { generatePassword } from "./passwordGenerator";
import axios from "axios";
import { Label } from "@/components/ui/label";

// Define the initial state for our expanded form
const initialFormState: Omit<User, 'role' | '_id' | 'password' | 'createdOn' | 'updatedOn' | 'registeredClientCount' > = {
  name: "",
  email: "",
  phoneNumber: "",
  whatsappNumber: "",
  city: "",
  status: "New",
  leaderCode: "",
  abhi_aap_kya_karte_hai: "",
  work_experience: "",
  income: 0
};

export default function Users() {
  const dispatch = useDispatch<AppDispatch>();
  const users: User[] = useSelector(selectUsers);
  const loading: boolean = useSelector(selectLoading);
  const pagination = useSelector(selectPagination);
  const currentPage = useSelector(selectCurrentPage);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState(initialFormState);
  const [formLoading, setFormLoading] = useState(false);
  
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [importModalOpen, setImportModalOpen] = useState(false);
  
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [dateRangeCount, setDateRangeCount] = useState<number | null>(null);
  const [isCountLoading, setIsCountLoading] = useState<boolean>(false);
  const [countError, setCountError] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch users on mount and when filters/page change
  useEffect(() => {
    dispatch(fetchUsers({ search: debouncedSearch, status, page: currentPage }));
  }, [dispatch, debouncedSearch, status, currentPage]);

  const handlePageChange = (page: number) => {
    // Prevent fetching if the page is out of bounds
    if (page < 1 || page > pagination.totalPages) return;
    dispatch(fetchUsers({ search: debouncedSearch, status, page }));
  };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    handlePageChange(1); // Reset to page 1 on filter change
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
      abhi_aap_kya_karte_hai: user.abhi_aap_kya_karte_hai ?? '',
      work_experience: user.work_experience ?? ''
    });
    setIsModalOpen(true);
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prevForm => ({...prevForm, [name]: name === 'income' ? (value === '' ? '' : Number(value)) : value}));
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
        dispatch(fetchUsers({ search: debouncedSearch, status, page: currentPage }));
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
      const newPage = users.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      dispatch(fetchUsers({ search: debouncedSearch, status, page: newPage }));
    } finally {
      setDeleteLoading(false);
    }
  };
  
  const handleDateRangeSearch = async () => {
    if (!startDate || !endDate) return;
    setIsCountLoading(true);
    setCountError(null);
    setDateRangeCount(null);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/clients/getClientsCountByDate`, { startDate, endDate });
      setDateRangeCount(response.data?.data?.count ?? 0);
    } catch (error: any) {
      setCountError(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsCountLoading(false);
    }
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
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center items-end gap-2 p-4 border rounded-lg bg-slate-50 mb-4">
        <div className="space-y-1"><Label htmlFor="start-date" className="text-sm font-medium">Start Date</Label><Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}/></div>
        <div className="space-y-1"><Label htmlFor="end-date" className="text-sm font-medium">End Date</Label><Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}/></div>
        <Button onClick={handleDateRangeSearch} disabled={isCountLoading} className="gap-1"><Search className="w-4 h-4"/>{isCountLoading ? 'Searching...':'Search Dates'}</Button>
      </div>

      <div className="mb-4 h-6">
        {countError && <p className="text-red-500 font-medium">{countError}</p>}
        {dateRangeCount !== null && (<p className="text-lg font-semibold text-primary">Total Clients Found: {dateRangeCount}</p>)}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
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
                  <TableRow><TableCell colSpan={8} className="text-center py-8"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></TableCell></TableRow>
                ) : users.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8">No Leaders found.</TableCell></TableRow>
                ) : (
                  users.map((user: User, idx: number) => (
                    <TableRow key={user._id}>
                      <TableCell>{(currentPage - 1) * 8 + idx + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar><AvatarFallback>{user.name?.[0]?.toUpperCase()}</AvatarFallback></Avatar>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.phoneNumber || '-'}</TableCell>
                      <TableCell><Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status || 'N/A'}</Badge></TableCell>
                      <TableCell>{user.leaderCode || '-'}</TableCell>
                      <TableCell>{user.createdOn ? new Date(user.createdOn).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>{user.registeredClientCount}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost" onClick={() => openEditModal(user)} title="Edit"><Edit className="w-4 h-4" /></Button>
                          <Dialog open={deleteUser?._id === user._id} onOpenChange={(open) => !open && setDeleteUser(null)}>
                            <DialogTrigger asChild><Button size="icon" variant="ghost" onClick={() => setDeleteUser(user)} title="Delete"><Trash2 className="w-4 h-4 text-red-500" /></Button></DialogTrigger>
                            <DialogContent>
                              <DialogHeader><DialogTitle>Delete Leader</DialogTitle><DialogDescription>Are you sure you want to delete <b>{user.name}</b>?</DialogDescription></DialogHeader>
                              <DialogFooter>
                                <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>{deleteLoading ? "Deleting..." : "Delete"}</Button>
                                <DialogClose asChild><Button type="button" variant="outline" disabled={deleteLoading}>Cancel</Button></DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
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

      {/* --- FUNCTIONAL PAGINATION --- */}
      {pagination.totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}>
                <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} />
              </PaginationItem>
              
              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink href="#" isActive={currentPage === i + 1} onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem className={currentPage === pagination.totalPages ? "pointer-events-none opacity-50" : ""}>
                <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} />
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
              <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" value={form.email} onChange={handleFormChange}/></div>
              <div className="space-y-2"><Label htmlFor="phoneNumber">Phone Number*</Label><Input id="phoneNumber" name="phoneNumber" value={form.phoneNumber} onChange={handleFormChange} required /></div>
              <div className="space-y-2"><Label htmlFor="whatsappNumber">WhatsApp Number</Label><Input id="whatsappNumber" name="whatsappNumber" value={form.whatsappNumber} onChange={handleFormChange}/></div>
              <div className="space-y-2"><Label htmlFor="city">City</Label><Input id="city" name="city" value={form.city} onChange={handleFormChange}/></div>
              <div className="space-y-2"><Label htmlFor="income">Income</Label><Input id="income" name="income" type="number" value={form.income || ''} onChange={handleFormChange}/></div>
              <div className="space-y-2"><Label htmlFor="leaderCode">Leader Code</Label><Input id="leaderCode" name="leaderCode" value={form.leaderCode} onChange={handleFormChange}/></div>
              <div className="space-y-2"><Label htmlFor="status">Status</Label><Select value={form.status} onValueChange={(value) => handleFormSelectChange('status', value)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="New">New</SelectItem><SelectItem value="Active">Active</SelectItem><SelectItem value="Inactive">Inactive</SelectItem></SelectContent></Select></div>
              <div className="space-y-2 md:col-span-2"><Label htmlFor="work_experience">Work Experience</Label><Input id="work_experience" name="work_experience" value={form.work_experience} onChange={handleFormChange}/></div>
              <div className="space-y-2 md:col-span-2"><Label htmlFor="abhi_aap_kya_karte_hai">Current Occupation</Label><Input id="abhi_aap_kya_karte_hai" name="abhi_aap_kya_karte_hai" value={form.abhi_aap_kya_karte_hai} onChange={handleFormChange}/></div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline" disabled={formLoading}>Cancel</Button></DialogClose>
              <Button type="submit" disabled={formLoading}>{formLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}{formLoading ? 'Saving...' : (editUser ? 'Update Leader' : 'Add Leader')}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <ImportUser open={importModalOpen} onOpenChange={setImportModalOpen} onImportSuccess={() => dispatch(fetchUsers())} />
    </div>
  );
}