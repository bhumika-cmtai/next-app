"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchUsers, deleteUser } from "@/lib/redux/userSlice"; 
import type { User } from "@/lib/services/userService";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { UserTable } from "./UserTable";
import { UserFormDialog } from "./UserFormDialog";
import { DeleteConfirmationDialog } from "../DeleteConfirmationDialog";
import { UserViewDialog } from "./UserViewDialog";

export function UserClient() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, status, totalUsers, totalPages, currentPage } = useSelector(
    (state: RootState) => state.users
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false)
  useEffect(() => {
    // Fetch users on initial load or when status is reset to 'idle'
    if (status === "idle") {
      dispatch(fetchUsers({ page: 1, limit: 10 }));
    }
  }, [status, dispatch]);

  const handlePageChange = (direction: "next" | "prev") => {
    const newPage = direction === "next" ? currentPage + 1 : currentPage - 1;
    if (newPage > 0 && newPage <= totalPages) {
      dispatch(fetchUsers({ page: newPage, limit: 10 }));
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleViewUser = (user: User) => {
      setSelectedUser(user);
      setIsViewOpen(true);
    };
  
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedUser) return;

    const promise = dispatch(deleteUser(selectedUser._id)).unwrap();

    toast.promise(promise, {
      loading: "Deleting user...",
      success: () => {
        // Handle pagination edge case: if last user on a page is deleted, go back a page.
        if (users.length === 1 && currentPage > 1) {
          handlePageChange("prev");
        } else if (status !== 'loading') {
          // If not changing page, force a refetch to ensure data consistency
          dispatch(fetchUsers({ page: currentPage, limit: 10 }));
        }
        return `User "${selectedUser.name}" deleted successfully.`;
      },
      error: "Failed to delete user.",
    });

    setIsDeleteConfirmOpen(false);
    setSelectedUser(null);
  };

  const isLoading = status === "loading";

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Manage all users in your system.
              </CardDescription>
            </div>
            <Button
              size="sm"
              className="h-9 gap-1 bg-gray-900 text-white hover:bg-black hover:cursor-pointer"
              onClick={handleAddUser}
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Add User</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <UserTable
            users={users}
            onEdit={handleEditUser}
            onView={handleViewUser} 
            onDelete={handleDeleteUser}
            isLoading={isLoading}
          />
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Showing{" "}
            <strong>
              {users.length > 0 ? (currentPage - 1) * 10 + 1 : 0}-
              {(currentPage - 1) * 10 + users.length}
            </strong>{" "}
            of <strong>{totalUsers}</strong> users
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => handlePageChange("prev")}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => handlePageChange("next")}
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>

      <UserViewDialog
        isOpen={isViewOpen}
        onOpenChange={setIsViewOpen}
        user={selectedUser}
      />

      <UserFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        user={selectedUser}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        onConfirm={confirmDelete}
        userName={selectedUser?.name || ""}
      />
    </>
  );
}