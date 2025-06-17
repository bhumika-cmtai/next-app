// // app/dashboard/leads/_components/LeadFormDialog.tsx
// "use client";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "@/lib/store";
// import { toast } from "sonner";
// import { useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { addNewLead, updateLead } from "@/lib/redux/leadSlice";
// import type { Lead } from "@/lib/services/leadService";

// const formSchema = z.object({
//   name: z.string().min(2, "Name must be at least 2 characters."),
//   email: z.string().email("Invalid email address."),
//   phoneNumber: z.string().min(10, "Phone number seems too short."),
//   status: z.enum(['New', 'Contacted', 'NotInterested']),
// });

// interface LeadFormDialogProps { isOpen: boolean; onOpenChange: (isOpen: boolean) => void; lead: Lead | null; }

// export function LeadFormDialog({ isOpen, onOpenChange, lead }: LeadFormDialogProps) {
//   const dispatch = useDispatch<AppDispatch>();
//   const isEditMode = !!lead;

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: { name: "", email: "", phoneNumber: "", status: "New" },
//   });

//   useEffect(() => {
//     if (isOpen) {
//       form.reset(lead ? lead : { name: "", email: "", phoneNumber: "", status: "New" });
//     }
//   }, [isOpen, lead, form]);

//   const onSubmit = (values: z.infer<typeof formSchema>) => {
//     const promise = isEditMode
//       ? dispatch(updateLead({ id: lead!._id, leadData: values })).unwrap()
//       : dispatch(addNewLead(values)).unwrap();
    
//     toast.promise(promise, {
//       loading: isEditMode ? 'Updating lead...' : 'Adding lead...',
//       success: (data) => { onOpenChange(false); return `Lead "${data.name}" ${isEditMode ? 'updated' : 'added'}.`; },
//       error: (err) => `Error: ${err.message}`,
//     });
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onOpenChange}><DialogContent className="sm:max-w-md">
//       <DialogHeader><DialogTitle>{isEditMode ? "Edit Lead" : "Add New Lead"}</DialogTitle><DialogDescription>{isEditMode ? "Make changes to the lead profile." : "Fill in the details to create a new lead."}</DialogDescription></DialogHeader>
//       <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
//         <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
//         <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)}/>
//         <FormField control={form.control} name="phoneNumber" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
//         <FormField control={form.control} name="status" render={({ field }) => (<FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="New">New</SelectItem><SelectItem value="Contacted">Contacted</SelectItem><SelectItem value="NotInterested">Not Interested</SelectItem></SelectContent></Select><FormMessage /></FormItem>)}/>
//         <Button type="submit" className="w-full bg-red-600 text-white hover:bg-red-700" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? 'Saving...' : (isEditMode ? "Save Changes" : "Create Lead")}</Button>
//       </form></Form>
//     </DialogContent></Dialog>
//   );
// }