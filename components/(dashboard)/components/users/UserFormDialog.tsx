// app/dashboard/users/_components/UserFormDialog.tsx
"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { toast } from "sonner";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"; // Import Form components
import { addNewUser, updateUser } from "@/lib/redux/userSlice"; // Import User from slice
import type { User } from "@/lib/services/userService";


// We can make the password required only when adding a new user.
// Zod's `refine` is perfect for this conditional validation.
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phoneNumber: z.string().min(10, "Phone number seems too short."),
  role: z.enum(["sales", "developer", "admin"]),
  password: z.string().optional(), // Make it optional at the base level
});

interface UserFormDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    user: User | null;
}

export function UserFormDialog({ isOpen, onOpenChange, user }: UserFormDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const isEditMode = !!user;

  // Refine the schema based on whether we are in edit mode or not
  const refinedSchema = formSchema.refine((data) => {
    // If not in edit mode (i.e., adding a new user), the password must exist and be at least 4 chars.
    return isEditMode || (data.password && data.password.length >= 4);
  }, {
    message: "Password must be at least 4 characters for new users.",
    path: ["password"], // Associate the error with the password field
  });

  const form = useForm<z.infer<typeof refinedSchema>>({
    resolver: zodResolver(refinedSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      role: "sales",
      password: "",
    },
  });

  useEffect(() => {
    // When the user prop changes, reset the form
    if (user) {
        form.reset({
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            password: '', // Always clear password field on open
        });
    } else {
        form.reset({
            name: "",
            email: "",
            phoneNumber: "",
            role: "sales",
            password: "",
        });
    }
  }, [user, form, isOpen]); // Also reset on isOpen to clear form when re-opening for "Add"

  const onSubmit = async (values: z.infer<typeof refinedSchema>) => {
    let promise;
    
    if (isEditMode) {
        // For updating, we don't want to send an empty password.
        const { password, ...updateData } = values;
        const userDataToUpdate = password ? values : updateData;

        // Dispatch the action and call .unwrap() to get a standard promise
        promise = dispatch(
            updateUser({ id: user!._id, userData: userDataToUpdate })
        ).unwrap();
    } else {
        // For adding a new user, password is required by our refined schema.
        // The type `Omit<User, ...>` matches the form values perfectly now.
        promise = dispatch(addNewUser(values as any)).unwrap(); // `as any` is a pragmatic choice if TS still struggles with the complex Omit type.
    }
        
    toast.promise(promise, {
      loading: isEditMode ? 'Updating user...' : 'Adding user...',
      success: (data) => { // `data` is now the actual User payload, not an action
        onOpenChange(false);
        return `User "${data.name}" ${isEditMode ? 'updated' : 'added'} successfully!`;
      },
      error: (error) => { // `error` is the actual error thrown by the rejected thunk
        // The error object might be the string from `rejectWithValue`
        return error || 'An unknown error occurred.';
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Make changes to the user profile." : "Fill in the details to create a new user."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input type="email" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                {!isEditMode && (
                  <FormField control={form.control} name="password" render={({ field }) => (
                      <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl><Input type="password" {...field} /></FormControl>
                          <FormMessage />
                      </FormItem>
                  )}/>
                )}
                <FormField control={form.control} name="role" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="sales">Sales</SelectItem>
                                <SelectItem value="developer">Developer</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}/>
                <Button type="submit" className="w-full bg-gray-900 text-white hover:bg-gray-800" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Saving...' : (isEditMode ? "Save Changes" : "Create User")}
                </Button>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}