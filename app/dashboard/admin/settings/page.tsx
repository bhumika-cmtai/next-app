// app/dashboard/settings/page.tsx

"use client";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { 
  fetchCurrentUser, 
  selectUser, 
  selectIsLoading as selectAuthLoading, 
  updateUserProfile, 
  selectError as selectAuthError,
  setError as setAuthError,
  updateSessionDetails,
  fetchSession, 
  GlobalSession      
} from '@/lib/redux/authSlice';
import { 
  fetchAllAppLinks, 
  updateAppLink, 
  selectAllAppLinks, 
  selectAppLinksLoading, 
  AppLink 
} from '@/lib/redux/appLinkSlice';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User, Landmark, Edit, Clock, KeyRound } from 'lucide-react';
import { toast } from 'sonner';

const DetailItem = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div className="flex justify-between items-center py-3 border-b last:border-b-0">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-sm text-gray-900 break-all">{value || '-'}</p>
  </div>
);

const SettingsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Auth State
  const user = useSelector(selectUser);
  const isAuthLoading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);

  // AppLinks State
  const appLinks = useSelector(selectAllAppLinks);
  const isLinksLoading = useSelector(selectAppLinksLoading);

  const [activeTab, setActiveTab] = useState<'profile' | 'session' | 'passwords'>('profile');
  
  // Profile Modal State
  const [profileData, setProfileData] = useState({ name: '', whatsappNumber: '', city: '', bio: '', newPassword: '', confirmPassword: '' });
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  
  // Session State
  const [sessionData, setSessionData] = useState<Partial<GlobalSession>>({});
  const [isSessionLoading, setIsSessionLoading] = useState(false);

  // AppLink Modal State
  const [isLinkModalOpen, setLinkModalOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState<AppLink | null>(null);

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
    if (activeTab === 'passwords' && user?.role === 'admin' && appLinks.length === 0) {
      dispatch(fetchAllAppLinks());
    }
  }, [dispatch, activeTab, user, appLinks.length]);

  useEffect(() => {
    if (authError) {
      toast.error(authError);
      dispatch(setAuthError(null));
    }
  }, [authError, dispatch]);

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name || '', whatsappNumber: user.whatsappNumber || '', city: user.city || '', bio: user.bio || '', newPassword: '', confirmPassword: '' });
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToUpdate: { [key: string]: any } = { name: profileData.name, whatsappNumber: profileData.whatsappNumber, city: profileData.city, bio: profileData.bio };
    if (profileData.newPassword) {
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
      await loadSession();
    }
  };

  const handleOpenLinkModal = (link: AppLink) => {
    setCurrentLink(link);
    setLinkModalOpen(true);
  };

  const handleLinkUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentLink) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const updateData: Partial<AppLink> = {
      appName: formData.get('appName') as string,
      link: formData.get('link') as string,
    };
    const newPassword = formData.get('password') as string;
    if (newPassword) {
      updateData.password = newPassword;
    }

    const result = await dispatch(updateAppLink(currentLink._id, updateData));
    if (result) {
      setLinkModalOpen(false);
      setCurrentLink(null);
    }
  };

  if (isAuthLoading && !user) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  if (!user) {
    return <div className="flex items-center justify-center h-screen"><p>Could not load user data. Please try logging in again.</p></div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <Card className="max-w-4xl mx-auto shadow-md">
        <CardHeader className="text-center md:text-left">
          <CardTitle className="text-3xl font-bold">Account Settings</CardTitle>
          <CardDescription>View and manage your personal details and application settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex border-b mb-6 overflow-x-auto">
            <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-2 py-3 px-4 text-sm font-medium transition-colors shrink-0 ${activeTab === 'profile' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-primary'}`}><User size={16} /> Profile Details</button>
            {user.role === 'admin' && (
              <>
                <button onClick={() => setActiveTab('session')} className={`flex items-center gap-2 py-3 px-4 text-sm font-medium transition-colors shrink-0 ${activeTab === 'session' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-primary'}`}><Clock size={16} /> Claim Client</button>
                <button onClick={() => setActiveTab('passwords')} className={`flex items-center gap-2 py-3 px-4 text-sm font-medium transition-colors shrink-0 ${activeTab === 'passwords' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-primary'}`}><KeyRound size={16} /> Manage Passwords</button>
              </>
            )}
          </div>

          {activeTab === 'profile' && (
            <div>
              <DetailItem label="Full Name" value={user.name} />
              <DetailItem label="Email" value={user.email} />
              <DetailItem label="Role" value={user.role} />
              <DetailItem label="WhatsApp Number" value={user.whatsappNumber} />
              <DetailItem label="City" value={user.city} />
              <DetailItem label="Bio" value={user.bio} />
              <Dialog open={isProfileModalOpen} onOpenChange={setProfileModalOpen}><DialogTrigger asChild><Button className="mt-6 w-full md:w-auto"><Edit className="mr-2 h-4 w-4" /> Update Profile</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Update Profile Details</DialogTitle></DialogHeader><form onSubmit={handleProfileUpdate} className="space-y-4 pt-4"><div className="space-y-2"><Label htmlFor="name">Full Name</Label><Input id="name" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} /></div><div className="space-y-2"><Label htmlFor="whatsapp">WhatsApp Number</Label><Input id="whatsapp" value={profileData.whatsappNumber} onChange={(e) => setProfileData({ ...profileData, whatsappNumber: e.target.value })} /></div><div className="space-y-2"><Label htmlFor="city">City</Label><Input id="city" value={profileData.city} onChange={(e) => setProfileData({ ...profileData, city: e.target.value })} /></div><div className="space-y-2"><Label htmlFor="bio">Bio</Label><Input id="bio" value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} /></div><div className="space-y-2"><Label htmlFor="newPassword">New Password</Label><Input id="newPassword" type="password" placeholder="Leave blank to keep current" value={profileData.newPassword} onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })} /></div><div className="space-y-2"><Label htmlFor="confirmPassword">Confirm New Password</Label><Input id="confirmPassword" type="password" placeholder="Confirm new password" value={profileData.confirmPassword} onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })} /></div><DialogFooter><Button type="submit" disabled={isAuthLoading}>{isAuthLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}</Button></DialogFooter></form></DialogContent></Dialog>
            </div>
          )}

          {activeTab === 'session' && user.role === 'admin' && (
             <div>
              {isSessionLoading ? (
                 <div className="flex items-center justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : (
                <>
                  <div className="mb-8 p-4 bg-slate-50 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-2">Current Claim Session Schedule</h3>
                    {sessionData?.sessionStartDate ? (
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
                      <div className="space-y-2"><Label htmlFor="start-date">Start Date</Label><Input id="start-date" type="date" value={sessionData?.sessionStartDate || ''} onChange={(e) => setSessionData({...sessionData, sessionStartDate: e.target.value})}/></div>
                      <div className="space-y-2"><Label htmlFor="start-time">Start Time</Label><Input id="start-time" type="time" value={sessionData?.sessionStartTime || ''} onChange={(e) => setSessionData({...sessionData, sessionStartTime: e.target.value})}/></div>
                      <div className="space-y-2"><Label htmlFor="end-date">End Date</Label><Input id="end-date" type="date" value={sessionData?.sessionEndDate || ''} onChange={(e) => setSessionData({...sessionData, sessionEndDate: e.target.value})}/></div>
                      <div className="space-y-2"><Label htmlFor="end-time">End Time</Label><Input id="end-time" type="time" value={sessionData?.sessionEndTime || ''} onChange={(e) => setSessionData({...sessionData, sessionEndTime: e.target.value})}/></div>
                    </div>
                    <div className="flex justify-end"><Button type="submit" disabled={isAuthLoading} className="w-full md:w-auto">{isAuthLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Clock className="mr-2 h-4 w-4"/>}Update Session</Button></div>
                  </form>
                </>
              )}
            </div>
          )}

          {activeTab === 'passwords' && user.role === 'admin' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Application Links & Passwords</h3>
              {isLinksLoading && appLinks.length === 0 ? (
                <div className="flex items-center justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : (
                <div className="space-y-4">
                  {appLinks.map((link) => (
                    <div key={link._id} className="p-4 border rounded-lg flex items-center justify-between">
                      <div className='flex flex-col gap-3'>
                        
                          <p className="font-semibold">{link.appName}</p>
                          <p className="text-sm"><b >Password: </b>{link.password}</p>
                        
                        <p className="text-base  truncate"><b>Link: </b>{link.link}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleOpenLinkModal(link)}><Edit className="mr-2 h-3 w-3" /> Edit</Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AppLink Edit Modal */}
      <Dialog open={isLinkModalOpen} onOpenChange={setLinkModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit App Link</DialogTitle></DialogHeader>
          {currentLink && (
            <form onSubmit={handleLinkUpdate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="appName">App Name</Label>
                <Input id="appName" name="appName" defaultValue={currentLink.appName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link">Link</Label>
                <Input id="link" name="link" defaultValue={currentLink.link} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input id="password" name="password" type="text" placeholder="Leave blank to keep unchanged"  defaultValue={currentLink.password}/>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLinksLoading}>
                  {isLinksLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;