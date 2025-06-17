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



const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phoneNumber: z.string().min(10, "Phone number seems too short."),
  role: z.enum(["sales", "developer", "admin"]),
  password: z.string().optional(),
});

interface UserFormDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    user: User | null;
}

export function UserFormDialog({ isOpen, onOpenChange, user }: UserFormDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const isEditMode = !!user;

  const refinedSchema = formSchema.refine((data) => {
    return isEditMode || (data.password && data.password.length >= 4);
  }, {
    message: "Password must be at least 4 characters for new users.",
    path: ["password"], 
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
    if (user) {
        form.reset({
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            password: '', 
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
  }, [user, form, isOpen]); 

  const onSubmit = async (values: z.infer<typeof refinedSchema>) => {
    let promise;
    
    if (isEditMode) {
        const { password, ...updateData } = values;
        const userDataToUpdate = password ? values : updateData;

        promise = dispatch(
            updateUser({ id: user!._id, userData: userDataToUpdate })
        ).unwrap();
    } else {
        promise = dispatch(addNewUser(values as any)).unwrap();
    }
        
    toast.promise(promise, {
      loading: isEditMode ? 'Updating user...' : 'Adding user...',
      success: (data) => { 
        onOpenChange(false);
        return `User "${data.name}" ${isEditMode ? 'updated' : 'added'} successfully!`;
      },
      error: (error) => { 
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