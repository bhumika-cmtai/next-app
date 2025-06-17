"use client";

import React, { useState, useMemo, useEffect, ChangeEvent, FormEvent } from "react";
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
import { fetchUsers, selectUsers, selectLoading, selectError, User } from "@/lib/redux/userSlice";
import { AppDispatch } from "@/lib/store";
import ImportUser from "./importUser";

export default function Users() {
  const dispatch = useDispatch<AppDispatch>();
  const users: User[] = useSelector(selectUsers);
  const loading: boolean = useSelector(selectLoading);
  const error = useSelector(selectError);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", status: "Active" });
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user: User) =>
        user.name.toLowerCase().includes(search.toLowerCase()) &&
        (status ? user.status === status : true)
    );
  }, [users, search, status]);

  // Pagination (simple, 1 page for demo)
  const pageUsers = filteredUsers;

  // Handlers
  const openAddModal = () => {
    setEditUser(null);
    setForm({ name: "", email: "", phone: "", status: "Active" });
    setModalOpen(true);
  };


  const openEditModal = (user: User) => {
    setEditUser(user);
    setForm({ name: user.name, email: user.email, phone: user.phone, status: user.status });
    setModalOpen(true);
  };


  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleFormStatus = (val: string) => setForm({ ...form, status: val });
  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    setTimeout(() => {
      if (editUser) {
        // This is just a placeholder, actual update logic should be via redux
        // setUsers((prev) => prev.map((u) => (u.id === editUser.id ? { ...u, ...form } : u)));
      } else {
        // setUsers((prev) => [
        //   ...prev,
        //   { ...form, id: Date.now(), joined: new Date().toISOString().slice(0, 10) },
        // ]);
      }
      setFormLoading(false);
      setModalOpen(false);
    }, 1000);
  };


  const handleDelete = () => {
    setDeleteLoading(true);
    setTimeout(() => {
      // setUsers((prev) => prev.filter((u) => u.id !== deleteUser?.id));
      setDeleteLoading(false);
      setDeleteUser(null);
    }, 1000);
  };

  const handleImportSuccess = () => {
    // Refresh the users list after successful import
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
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className="w-full sm:w-48"
          />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
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
                ) : pageUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  pageUsers.map((user: User, idx: number) => (
                    <TableRow key={user._id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.createdOn}</TableCell>
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
                                  name="phone"
                                  placeholder="Phone"
                                  value={form.phone}
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
              name="phone"
              placeholder="Phone"
              value={form.phone}
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

