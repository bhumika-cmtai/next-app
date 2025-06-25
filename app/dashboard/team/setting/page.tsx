// app/dashboard/settings/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/lib/store';
import { 
  fetchCurrentUser, 
  selectUser, 
  selectIsLoading, 
  updateUserProfile, 
  updateBankDetails, 
  selectError,
  setError
} from '@/lib/redux/authSlice';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User, Landmark, Edit } from 'lucide-react';
import { toast } from 'sonner';

// Helper component to display details neatly
const DetailItem = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div className="flex justify-between items-center py-3 border-b last:border-b-0">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-sm text-gray-900 break-all">{value || '-'}</p>
  </div>
);

const SettingsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  const [activeTab, setActiveTab] = useState<'profile' | 'bank'>('profile');
  
  // Local state for the update forms
  const [profileData, setProfileData] = useState({ name: '', whatsappNumber: '', city: '', bio: '' });
  const [bankData, setBankData] = useState({ account_number: '', Ifsc: '', upi_id: '' });

  // State to control dialog visibility
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isBankModalOpen, setBankModalOpen] = useState(false);

  // Fetch user details on component mount if not already in state
  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, user]);

  // Handle and clear errors
  useEffect(() => {
    if (error) {
        toast.error(error);
        dispatch(setError(null)); // Clear the error after showing it
    }
  }, [error, dispatch]);

  // When user data loads or updates, populate the local form states
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        whatsappNumber: user.whatsappNumber || '',
        city: user.city || '',
        bio: user.bio || '',
      });
      setBankData({
        account_number: user.account_number || '',
        Ifsc: user.Ifsc || '',
        upi_id: user.upi_id || '',
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(updateUserProfile(profileData));
    if (result) {
      toast.success("Profile updated successfully!");
      setProfileModalOpen(false); // Close the modal on success
    }
  };

  const handleBankUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(updateBankDetails(bankData));
    if (result) {
      toast.success("Bank details updated successfully!");
      setBankModalOpen(false); // Close the modal on success
    }
  };

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Could not load user data. Please try logging in again.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <Card className="max-w-4xl mx-auto shadow-md">
        <CardHeader className="text-center md:text-left">
          <CardTitle className="text-3xl font-bold">Account Settings</CardTitle>
          <CardDescription>View and manage your personal and financial details.</CardDescription>
          <div className="pt-4 border-t mt-4">
            <h3 className="text-xl font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-sm text-gray-500">Phone: {user.phoneNumber || '-'}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex border-b mb-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${activeTab === 'profile' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-primary'}`}
            >
              <User size={16} /> Profile Details
            </button>
            <button
              onClick={() => setActiveTab('bank')}
              className={`flex items-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${activeTab === 'bank' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-primary'}`}
            >
              <Landmark size={16} /> Bank Details
            </button>
          </div>

          {activeTab === 'profile' && (
            <div>
              <DetailItem label="Full Name" value={user.name} />
              <DetailItem label="WhatsApp Number" value={user.whatsappNumber} />
              <DetailItem label="City" value={user.city} />
              <DetailItem label="Bio" value={user.bio} />
              
              <Dialog open={isProfileModalOpen} onOpenChange={setProfileModalOpen}>
                <DialogTrigger asChild>
                  <Button className="mt-6 w-full md:w-auto"><Edit className="mr-2 h-4 w-4" /> Update Profile</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Update Profile Details</DialogTitle></DialogHeader>
                  <form onSubmit={handleProfileUpdate} className="space-y-4 pt-4">
                    <div className="space-y-2"><Label htmlFor="name">Full Name</Label><Input id="name" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} /></div>
                    <div className="space-y-2"><Label htmlFor="whatsapp">WhatsApp Number</Label><Input id="whatsapp" value={profileData.whatsappNumber} onChange={(e) => setProfileData({...profileData, whatsappNumber: e.target.value})} /></div>
                    <div className="space-y-2"><Label htmlFor="city">City</Label><Input id="city" value={profileData.city} onChange={(e) => setProfileData({...profileData, city: e.target.value})} /></div>
                    <div className="space-y-2"><Label htmlFor="bio">Bio</Label><Input id="bio" value={profileData.bio} onChange={(e) => setProfileData({...profileData, bio: e.target.value})} /></div>
                    <DialogFooter><Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}</Button></DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {activeTab === 'bank' && (
            <div>
              <DetailItem label="Account Number" value={user.account_number} />
              <DetailItem label="IFSC Code" value={user.Ifsc} />
              <DetailItem label="UPI ID" value={user.upi_id} />
              
              <Dialog open={isBankModalOpen} onOpenChange={setBankModalOpen}>
                <DialogTrigger asChild>
                   <Button className="mt-6 w-full md:w-auto"><Edit className="mr-2 h-4 w-4" /> Update Bank Details</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Update Bank Details</DialogTitle></DialogHeader>
                  <form onSubmit={handleBankUpdate} className="space-y-4 pt-4">
                     <div className="space-y-2"><Label htmlFor="account_number">Account Number</Label><Input id="account_number" value={bankData.account_number} onChange={(e) => setBankData({...bankData, account_number: e.target.value})} /></div>
                     <div className="space-y-2"><Label htmlFor="ifsc">IFSC Code</Label><Input id="ifsc" value={bankData.Ifsc} onChange={(e) => setBankData({...bankData, Ifsc: e.target.value})} /></div>
                     <div className="space-y-2"><Label htmlFor="upi">UPI ID</Label><Input id="upi" value={bankData.upi_id} onChange={(e) => setBankData({...bankData, upi_id: e.target.value})} /></div>
                    <DialogFooter><Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}</Button></DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;