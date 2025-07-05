"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { AppDispatch } from "@/lib/store";
import {
  fetchLeadByTransactionId,
  selectLeadById,
  selectLoading,
  selectError,
  clearSelectedLead,
} from "@/lib/redux/leadSlice"; // Ensure leadSlice is correctly imported

export default function Clients() {
  const dispatch = useDispatch<AppDispatch>();

  // --- Component State ---
  const [transactionId, setTransactionId] = useState("");
  const [searchAttempted, setSearchAttempted] = useState(false);

  // --- Redux State ---
  const lead = useSelector(selectLeadById);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  // --- Cleanup Effect ---
  // Clears the selected lead from the Redux store when the component is unmounted
  // to prevent showing stale data.
  useEffect(() => {
    return () => {
      dispatch(clearSelectedLead());
    };
  }, [dispatch]);

  // --- Handler for Lead Search ---
  const handleGetLeadSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      toast.error("Please enter a transaction ID.");
      return;
    }
    setSearchAttempted(true);
    // Dispatch the thunk to fetch the lead
    dispatch(fetchLeadByTransactionId(transactionId.trim()));
  };

  // --- Helper to determine badge color based on status ---
  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      New: "bg-blue-500",
      RegisterationDone: "bg-teal-500",
      CallCut: "bg-yellow-500",
      CallNotPickUp: "bg-orange-500",
      NotInterested: "bg-red-500",
      InvalidNumber: "bg-gray-600",
      Converted: "bg-green-500",
    };
    return statusColors[status] || "bg-gray-400";
  };

  return (
    <div className="w-full mx-auto mt-2 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Get Lead by Transaction ID</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleGetLeadSubmit}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Input
              placeholder="Enter Transaction ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full sm:flex-1"
            />
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Get Lead"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* --- Results Section --- */}
      {/* This section only appears after a search has been attempted */}
      {searchAttempted && (
        <Card>
          <CardHeader>
            <CardTitle>Search Result</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex items-center justify-center p-6 text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="ml-2">Searching for lead...</span>
              </div>
            )}

            {!loading && error && (
              <p className="text-center p-6 text-destructive">
                Error: {error}
              </p>
            )}

            {/* If a lead is found, display it in the table */}
            {!loading && !error && lead && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">S.No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow key={lead._id}>
                    <TableCell>1</TableCell>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.phoneNumber}</TableCell>
                    <TableCell>
                      <Badge
                        className={`${getStatusColor(
                          lead.status || ""
                        )} text-white`}
                      >
                        {lead.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}

            {/* If no lead is found after searching */}
            {!loading && !error && !lead && (
              <p className="text-center p-6 text-muted-foreground">
                No lead found for the provided transaction ID.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}