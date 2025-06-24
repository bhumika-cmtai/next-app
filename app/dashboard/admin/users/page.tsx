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
import { Plus, Upload, Edit, Trash2 } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, selectUsers, selectLoading, User, selectPagination, selectCurrentPage,addUser,updateUser,deleteUser as deleteUserAction, } from "@/lib/redux/userSlice";
import { AppDispatch } from "@/lib/store";
import ImportUser from "./importUser";
import { generatePassword } from "./passwordGenerator";

export default function Users() {
  const dispatch = useDispatch<AppDispatch>();
  const users: User[] = useSelector(selectUsers);
  const loading: boolean = useSelector(selectLoading);
  const pagination = useSelector(selectPagination);
  const currentPage = useSelector(selectCurrentPage);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phoneNumber: "", status: "New" });
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch users on mount and when filters/page change
  useEffect(() => {
    dispatch(fetchUsers({ search: debouncedSearch, status, page: currentPage }));
  }, [dispatch, debouncedSearch, status, currentPage]);

  // Handlers
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    // Reset to first page on filter change
    // No need to dispatch here, debounced effect will handle it
  };
  const handleStatusChange = (val: string) => {
    setStatus(val);
    dispatch(fetchUsers({ search: debouncedSearch, status: val, page: 1 }));
  };
  const handlePageChange = (page: number) => {
    dispatch(fetchUsers({ search: debouncedSearch, status, page }));
  };

  const openAddModal = () => {
    setEditUser(null);
    setForm({ name: "", email: "", phoneNumber: "", status: "New" });
    setModalOpen(true);
  };


  const openEditModal = (user: User) => {
    setEditUser(user);
    setForm({ name: user.name, email: user.email, phoneNumber: user.phoneNumber || "", status: user.status || "New" });
    setModalOpen(true);
  };


  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleFormStatus = (val: string) => setForm({ ...form, status: val });
  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      let response;
      if (editUser && editUser._id) {
        // For updates, merge existing user data with form data to create the payload
        const updatedUserPayload: User = { ...editUser, ...form };
        response = await dispatch(updateUser(editUser._id, updatedUserPayload));
      } else {
        // Generate password for new user
        const generatedPassword = generatePassword(form.name, form.phoneNumber);
        
        const newUserPayload: User = {
          ...form,
          role: "user", 
          password: generatedPassword,
          whatsappNumber: form.phoneNumber, // Default whatsapp to phone
          city: "",
        };
        response = await dispatch(addUser(newUserPayload));
      }

      if (response) {
        setModalOpen(false);
        setEditUser(null);
        dispatch(fetchUsers({ search: debouncedSearch, status, page: currentPage }));
      }
    } catch (error) {
      console.error("An unexpected error occurred during form submission:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteUser || !deleteUser._id) return;

    setDeleteLoading(true);
    try {
      const response = await dispatch(deleteUserAction(deleteUser._id));
      if (response) {
        setDeleteUser(null); 
        
        const newPage = users.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
        
        dispatch(fetchUsers({ search: debouncedSearch, status, page: newPage }));
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleImportSuccess = () => {
    dispatch(fetchUsers());
  };

  return (
    <div className="w-full mx-auto mt-2">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">User List</h1>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search users..."
            value={search}
            onChange={handleSearchChange}
            className="w-full sm:w-48"
          />
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="default" size="sm" className="gap-1" onClick={openAddModal}>
            <Plus className="w-4 h-4" /> Add User
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
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>LeaderCode</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user: User, idx: number) => (
                    <TableRow key={user._id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{user.name?.[0].toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phoneNumber || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                          {user.status || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.leaderCode || '-'}</TableCell>
                      <TableCell>
                      {user.createdOn ? new Date(parseInt(user.createdOn, 10)).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog open={modalOpen && editUser?._id === user._id} onOpenChange={(open) => {
                            setModalOpen(open);
                            if (!open) setEditUser(null);
                          }}>
                            <DialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => openEditModal(user)}
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit User</DialogTitle>
                              </DialogHeader>
                              <form onSubmit={handleFormSubmit} className="space-y-4 mt-2">
                                <Input
                                  name="name"
                                  placeholder="Name"
                                  value={form.name}
                                  onChange={handleFormChange}
                                  required
                                />
                                <Input
                                  name="email"
                                  placeholder="Email"
                                  type="email"
                                  value={form.email}
                                  onChange={handleFormChange}
                                  required
                                />
                                <Input
                                  name="phoneNumber"
                                  placeholder="Phone"
                                  value={form.phoneNumber}
                                  onChange={handleFormChange}
                                  required
                                />
                                <Select value={form.status} onValueChange={handleFormStatus}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                  </SelectContent>
                                </Select>
                                <DialogFooter>
                                  <Button type="submit" disabled={formLoading}>
                                    {formLoading ? "Saving..." : "Update"}
                                  </Button>
                                  <DialogClose asChild>
                                    <Button type="button" variant="outline" disabled={formLoading}>
                                      Cancel
                                    </Button>
                                  </DialogClose>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>
                          <Dialog open={deleteUser?._id === user._id} onOpenChange={(open) => !open && setDeleteUser(null)}>
                            <DialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setDeleteUser(user)}
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete User</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete <b>{user.name}</b>?
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button
                                  variant="destructive"
                                  onClick={handleDelete}
                                  disabled={deleteLoading}
                                >
                                  {deleteLoading ? "Deleting..." : "Delete"}
                                </Button>
                                <DialogClose asChild>
                                  <Button type="button" variant="outline" disabled={deleteLoading}>
                                    Cancel
                                  </Button>
                                </DialogClose>
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

      {/* Pagination */}
      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)} />
            </PaginationItem>
            {Array.from({ length: pagination.totalPages }, (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink href="#" isActive={currentPage === i + 1} onClick={() => handlePageChange(i + 1)}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href="#" onClick={() => currentPage < pagination.totalPages && handlePageChange(currentPage + 1)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Add User Dialog */}
      <Dialog open={modalOpen && !editUser} onOpenChange={(open) => {
        setModalOpen(open);
        if (!open) setEditUser(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4 mt-2">
            <Input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleFormChange}
              required
            />
            <Input
              name="email"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={handleFormChange}
              required
            />
            <Input
              name="phoneNumber"
              placeholder="Phone"
              value={form.phoneNumber}
              onChange={handleFormChange}
              required
            />
            <Select value={form.status} onValueChange={handleFormStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <DialogFooter>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? "Saving..." : "Add"}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={formLoading}>
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <ImportUser 
        open={importModalOpen}
        onOpenChange={setImportModalOpen}
        onImportSuccess={handleImportSuccess}
      />
    </div>
  );
}

