"use client";

import { useState, ChangeEvent, DragEvent } from "react";
import { FileUp, X } from "lucide-react";
import Papa from "papaparse";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { toast } from "sonner";

interface ImportUserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSuccess?: () => void;
}

interface ParsedUser {
  name: string;
  email: string;
  phone: string;
  status: string;
}

export default function ImportUser({ open, onOpenChange, onImportSuccess }: ImportUserProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileHeaders, setFileHeaders] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({
    name: "",
    email: "",
    phone: "",
    status: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "text/csv" || file.name.endsWith('.csv'))) {
      handleFileProcessing(file);
    } else {
      toast.error("Please upload a CSV file");
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === "text/csv" || file.name.endsWith('.csv'))) {
      handleFileProcessing(file);
    } else if (file) {
      toast.error("Please upload a CSV file");
      e.target.value = ''; // Reset input
    }
  };

  const handleFileProcessing = (file: File) => {
    setSelectedFile(file);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      preview: 5,
      complete: (results) => {
        if (results.data.length > 0 && typeof results.data[0] === 'object' && results.data[0] !== null) {
          const headers = Object.keys(results.data[0] as object);
          setFileHeaders(headers);
          setPreviewData(results.data);
        }
      },
      error: (error) => {
        toast.error("Error reading CSV file: " + error.message);
      }
    });
  };

  const handleFieldMapping = (field: string, value: string) => {
    setFieldMapping(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImport = async () => {
    if (!selectedFile || Object.values(fieldMapping).some(v => !v)) return;
    
    setIsProcessing(true);
    
    try {
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const mappedData = results.data.map((row: any) => {
            const mappedUser: ParsedUser = {
              name: row[fieldMapping.name],
              email: row[fieldMapping.email],
              phone: row[fieldMapping.phone],
              status: row[fieldMapping.status],
            };
            return mappedUser;
          });

          console.log('Mapped leads:', mappedData);
          toast.success(`Successfully parsed ${mappedData.length} leads`);
          
          handleReset();
          onOpenChange(false);
          onImportSuccess?.();
        },
        error: (error) => {
          toast.error("Error parsing CSV: " + error.message);
        },
      });
    } catch (error) {
      toast.error("Import failed: " + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setFileHeaders([]);
    setPreviewData([]);
    setFieldMapping({
      name: "",
      email: "",
      phone: "",
      status: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) handleReset();
      onOpenChange(open);
    }}>
      <DialogContent className="max-h-[90vh] w-screen max-w-[95%] !min-w-[80vw] flex flex-col gap-0 p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-2xl">Import Leads</DialogTitle>
          <DialogDescription className="text-base">
            Upload a CSV file to import multiple leads at once.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 px-6 overflow-y-auto">
          <div className="py-6 space-y-8">
            {!selectedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-gray-200"} p-10`}
              >
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="p-4 rounded-full bg-primary/10">
                    <FileUp className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Drag and drop your file here or</h3>
                    <p className="text-sm text-muted-foreground">Supported format: CSV</p>
                  </div>
                  <div className="w-full max-w-sm">
                    <Button 
                      variant="secondary" 
                      size="lg" 
                      className="w-full"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      Browse Files
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".csv,text/csv"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-primary/10">
                      <FileUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReset}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {previewData.length > 0 && (
                  <div className="space-y-6">
                    <div className="border rounded-lg p-6 bg-muted/50">
                      <h3 className="text-lg font-semibold mb-6">Preview & Field Mapping</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        {Object.keys(fieldMapping).map((field) => (
                          <div key={field}>
                            <label className="text-sm font-medium capitalize block mb-2">{field}</label>
                            <Select
                              value={fieldMapping[field]}
                              onValueChange={(value) => handleFieldMapping(field, value)}
                            >
                              <SelectTrigger className="w-full bg-white">
                                <SelectValue placeholder="Unmapped" />
                              </SelectTrigger>
                              <SelectContent>
                                {fileHeaders.map((header) => (
                                  <SelectItem key={header} value={header}>
                                    {header}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Data Preview</h3>
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {fileHeaders.map((header) => (
                                <TableHead key={header} className="font-semibold">
                                  {header}
                                </TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {previewData.map((row, idx) => (
                              <TableRow key={idx}>
                                {fileHeaders.map((header) => (
                                  <TableCell key={header}>{row[header]}</TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Showing first 5 rows of data</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t">
          <div className="flex gap-2">
            <Button
              type="button"
              disabled={!selectedFile || Object.values(fieldMapping).some(v => !v) || isProcessing}
              onClick={handleImport}
              size="lg"
            >
              {isProcessing ? "Processing..." : "Import Leads"}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline" size="lg">
                Cancel
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
