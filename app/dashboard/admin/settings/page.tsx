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
  setError,
  updateSessionDetails,
  fetchSession, 
  GlobalSession      
} from '@/lib/redux/authSlice';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User, Landmark, Edit, Clock } from 'lucide-react';
import { toast } from 'sonner';

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

  const [activeTab, setActiveTab] = useState<'profile' | 'session'>('profile');
  
  const [profileData, setProfileData] = useState({
     name: '', 
    whatsappNumber: '', 
    city: '', 
    bio: '', 
    newPassword: '',      
    confirmPassword: ''  
    });
  // const [bankData, setBankData] = useState({ account_number: '', Ifsc: '', upi_id: '' });
  
  const [sessionData, setSessionData] = useState<Partial<GlobalSession>>({});
  const [isSessionLoading, setIsSessionLoading] = useState(false);

  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isBankModalOpen, setBankModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, user]);

   const loadSession = async () => {
        setIsSessionLoading(true);
        const data: GlobalSession | null = await dispatch(fetchSession());
        if (data) {
            setSessionData({
                ...data,
                sessionStartDate: data.sessionStartDate ? new Date(data.sessionStartDate).toISOString().split('T')[0] : '',
                sessionEndDate: data.sessionEndDate ? new Date(data.sessionEndDate).toISOString().split('T')[0] : '',
            });
        }
        setIsSessionLoading(false);
    };
  useEffect(() => {
    if (activeTab === 'session' && user?.role === 'admin') {
      loadSession();
    }
  }, [dispatch, activeTab, user]);


  useEffect(() => {
    if (error) {
        toast.error(error);
        dispatch(setError(null));
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        whatsappNumber: user.whatsappNumber || '',
        city: user.city || '',
        bio: user.bio || '',
        newPassword: '',      
        confirmPassword: ''   
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
    
      const dataToUpdate: { [key: string]: any } = {
        name: profileData.name,
        whatsappNumber: profileData.whatsappNumber,
        city: profileData.city,
        bio: profileData.bio,
      };
    
      if (profileData.newPassword!="") {
        if (profileData.newPassword !== profileData.confirmPassword) {
          toast.error("New passwords do not match.");
          return; 
        }
        
        dataToUpdate.password = profileData.newPassword;
      }
    
      const result = await dispatch(updateUserProfile(dataToUpdate));
      
      if (result) {
        toast.success("Profile updated successfully!");
        setProfileModalOpen(false);
      }
    };

  // const handleBankUpdate = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const result = await dispatch(updateBankDetails(bankData));
  //   if (result) {
  //     toast.success("Bank details updated successfully!");
  //     setBankModalOpen(false);
  //   }
  // };

  const handleSessionUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const result: GlobalSession | null = await dispatch(updateSessionDetails(sessionData));
    if (result) {
      toast.success("Session details updated successfully!");
      setSessionData({
          ...result,
          sessionStartDate: result.sessionStartDate ? new Date(result.sessionStartDate).toISOString().split('T')[0] : '',
          sessionEndDate: result.sessionEndDate ? new Date(result.sessionEndDate).toISOString().split('T')[0] : '',
      });
      await loadSession()
    }
  };

  if (isLoading && !user) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  else if (!user) {
    return <div className="flex items-center justify-center h-screen"><p>Could not load user data. Please try logging in again.</p></div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <Card className="max-w-4xl mx-auto shadow-md">
        <CardHeader className="text-center md:text-left">
          <CardTitle className="text-3xl font-bold">Account Settings</CardTitle>
          <CardDescription>View and manage your personal and financial details.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex border-b mb-6">
            <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${activeTab === 'profile' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-primary'}`}><User size={16} /> Profile Details</button>
            {/* <button onClick={() => setActiveTab('bank')} className={`flex items-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${activeTab === 'bank' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-primary'}`}><Landmark size={16} /> Bank Details</button> */}
            
            {user.role === 'admin' && (
              <button onClick={() => setActiveTab('session')} className={`flex items-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${activeTab === 'session' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-primary'}`}><Clock size={16} /> Claim Client</button>
            )}
          </div>

          {activeTab === 'profile' && (
             <div>
              <DetailItem label="Full Name" value={user.name} />
              <DetailItem label="WhatsApp Number" value={user.whatsappNumber} />
              <DetailItem label="City" value={user.city} />
              <DetailItem label="Bio" value={user.bio} />
              <DetailItem label="Password" value={user.password} />
              <Dialog open={isProfileModalOpen} onOpenChange={setProfileModalOpen}><DialogTrigger asChild><Button className="mt-6 w-full md:w-auto"><Edit className="mr-2 h-4 w-4" /> Update Profile</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Update Profile Details</DialogTitle></DialogHeader>
              <form onSubmit={handleProfileUpdate} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input id="whatsapp" value={profileData.whatsappNumber} onChange={(e) => setProfileData({...profileData, whatsappNumber: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={profileData.city} onChange={(e) => setProfileData({...profileData, city: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input id="bio" value={profileData.bio} onChange={(e) => setProfileData({...profileData, bio: e.target.value})} />
                </div>
                
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <Input id="newPassword" type="password" placeholder="Leave blank to keep current" value={profileData.newPassword} onChange={(e) => setProfileData({...profileData, newPassword: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                        <Input id="confirmPassword" type="password" placeholder="Confirm new password" value={profileData.confirmPassword} onChange={(e) => setProfileData({...profileData, confirmPassword: e.target.value})} />
                                    </div>
                <DialogFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}</Button>
                </DialogFooter>
              </form>
              </DialogContent></Dialog>
            </div>
          )}

          {/* {activeTab === 'bank' && (
            <div><DetailItem label="Account Number" value={user.account_number} /><DetailItem label="IFSC Code" value={user.Ifsc} /><DetailItem label="UPI ID" value={user.upi_id} /><Dialog open={isBankModalOpen} onOpenChange={setBankModalOpen}><DialogTrigger asChild><Button className="mt-6 w-full md:w-auto"><Edit className="mr-2 h-4 w-4" /> Update Bank Details</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Update Bank Details</DialogTitle></DialogHeader><form onSubmit={handleBankUpdate} className="space-y-4 pt-4"><div className="space-y-2"><Label htmlFor="account_number">Account Number</Label><Input id="account_number" value={bankData.account_number} onChange={(e) => setBankData({...bankData, account_number: e.target.value})} /></div><div className="space-y-2"><Label htmlFor="ifsc">IFSC Code</Label><Input id="ifsc" value={bankData.Ifsc} onChange={(e) => setBankData({...bankData, Ifsc: e.target.value})} /></div><div className="space-y-2"><Label htmlFor="upi">UPI ID</Label><Input id="upi" value={bankData.upi_id} onChange={(e) => setBankData({...bankData, upi_id: e.target.value})} /></div><DialogFooter><Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}</Button></DialogFooter></form></DialogContent></Dialog></div>
          )} */}
          
          {activeTab === 'session' && user.role === 'admin' && (
            <div>
              {isSessionLoading ? (
                 <div className="flex items-center justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : (
                <>
                  <div className="mb-8 p-4 bg-slate-50 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-2">Current Claim Session Schedule</h3>
                    {sessionData && sessionData.sessionStartDate ? (
                       <div className="space-y-2 text-sm">
                          <p><strong>Starts:</strong> {new Date(sessionData.sessionStartDate).toLocaleDateString()} at {sessionData.sessionStartTime}</p>
                          <p><strong>Ends:</strong> {new Date(sessionData.sessionEndDate!).toLocaleDateString()} at {sessionData.sessionEndTime}</p>
                       </div>
                    ) : (
                      <p className="text-sm text-gray-500">No claim session has been set yet.</p>
                    )}
                  </div>
                
                  <form onSubmit={handleSessionUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="start-date">Start Date</Label>
                            <Input id="start-date" type="date" value={sessionData?.sessionStartDate || ''} onChange={(e) => setSessionData({...sessionData, sessionStartDate: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="start-time">Start Time</Label>
                            <Input id="start-time" type="time" value={sessionData?.sessionStartTime || ''} onChange={(e) => setSessionData({...sessionData, sessionStartTime: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="end-date">End Date</Label>
                            <Input id="end-date" type="date" value={sessionData?.sessionEndDate || ''} onChange={(e) => setSessionData({...sessionData, sessionEndDate: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="end-time">End Time</Label>
                            <Input id="end-time" type="time" value={sessionData?.sessionEndTime || ''} onChange={(e) => setSessionData({...sessionData, sessionEndTime: e.target.value})} />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />}
                            Update Claim Session
                        </Button>
                    </div>
                  </form>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;