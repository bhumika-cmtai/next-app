// components/common/resource-management/ResourceFormDialog.tsx
"use client";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { toast } from "sonner";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ResourceConfig, ResourceItem } from "./ResourceClient";

// The definition for a single field in the form
export interface FormFieldDef {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select';
  options?: { value: string; label: string }[];
  isHidden?: (isEditMode: boolean) => boolean; // Optional function to hide field
}

interface ResourceFormDialogProps<T extends ResourceItem> {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  item: T | null;
  config: ResourceConfig<T>;
}

export function ResourceFormDialog<T extends ResourceItem>({ isOpen, onOpenChange, item, config }: ResourceFormDialogProps<T>) {
  const dispatch = useDispatch<AppDispatch>();
  const isEditMode = !!item;

  const form = useForm<z.infer<typeof config.formSchema>>({
    resolver: zodResolver(config.formSchema),
  });

  useEffect(() => {
    if (isOpen) {
      // Create default values object dynamically from formFields
      const defaultValues = config.formFields.reduce((acc, field) => {
        acc[field.name] = '';
        return acc;
      }, {} as any);
      
      form.reset(item ? { ...item, password: '' } : defaultValues);
    }
  }, [isOpen, item, form, config.formFields]);

  const onSubmit = (values: z.infer<typeof config.formSchema>) => {
    const promise = isEditMode
      ? dispatch(config.reduxActions.update({ id: item!._id, userData: values })).unwrap()
      : dispatch(config.reduxActions.add(values)).unwrap();
    
    toast.promise(promise, {
      loading: `${isEditMode ? 'Updating' : 'Adding'} ${config.noun.toLowerCase()}...`,
      success: (data) => {
        onOpenChange(false);
        return `${config.noun} "${data.name}" ${isEditMode ? 'updated' : 'added'}.`;
      },
      error: (err) => `Error: ${err.message}`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? `Edit ${config.noun}` : `Add New ${config.noun}`}</DialogTitle>
          <DialogDescription>
            {isEditMode ? `Make changes to the ${config.noun.toLowerCase()} profile.` : `Fill in the details to create a new ${config.noun.toLowerCase()}.`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            {config.formFields.map((fieldDef) => {
              if (fieldDef.isHidden?.(isEditMode)) {
                return null;
              }
              return (
                <FormField
                  key={fieldDef.name}
                  control={form.control}
                  name={fieldDef.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fieldDef.label}</FormLabel>
                      {fieldDef.type === 'select' ? (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder={`Select a ${fieldDef.label.toLowerCase()}`} /></SelectTrigger></FormControl>
                          <SelectContent>
                            {fieldDef.options?.map(option => (
                              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <FormControl>
                          <Input type={fieldDef.type} {...field} />
                        </FormControl>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })}
            <Button type="submit" className="w-full bg-gray-800 text-white hover:bg-black" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Saving...' : (isEditMode ? "Save Changes" : `Create ${config.noun}`)}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}