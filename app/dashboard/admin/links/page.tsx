"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import {
  fetchAllLinks,
  createPortalLink,
  updatePortalLink,
  selectAllLinks,
  selectLinksLoading,
  PortalLink,
} from '@/lib/redux/linkSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Edit, Save, X } from 'lucide-react';

export default function PortalLinksPage() {
  const dispatch = useDispatch<AppDispatch>();
  const links = useSelector(selectAllLinks);
  const isLoading = useSelector(selectLinksLoading);

  // State for the "Create New" form
  const [newPortalName, setNewPortalName] = useState('');
  const [newLink, setNewLink] = useState('');
  
  // State for inline editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLinkValue, setEditingLinkValue] = useState('');

  useEffect(() => {
    dispatch(fetchAllLinks());
  }, [dispatch]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortalName || !newLink) {
        alert("Both Portal Name and Link URL are required.");
        return;
    };
    const result = await dispatch(createPortalLink({ portalName: newPortalName, link: newLink }));
    if (result) {
      // Clear the form on successful creation
      setNewPortalName('');
      setNewLink('');
    }
  };
  
  const handleEditClick = (link: PortalLink) => {
    setEditingId(link._id);
    setEditingLinkValue(link.link);
  };
  
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingLinkValue('');
  };
  
  const handleUpdateSubmit = async () => {
    if (!editingId || !editingLinkValue) return;
    const result = await dispatch(updatePortalLink(editingId, { link: editingLinkValue }));
    if (result) {
      handleCancelEdit(); // Close the edit form on success
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Create Form */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Create New Portal Link</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="portalName">Portal Name</Label>
                  <Input
                    id="portalName"
                    placeholder="e.g., phonepe"
                    value={newPortalName}
                    onChange={(e) => setNewPortalName(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link">Link URL</Label>
                  <Input
                    id="link"
                    type="url"
                    placeholder="e.g., https://phonepe.com"
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Create Link'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: List of Existing Links */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Existing Portal Links</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && links.length === 0 ? (
                <p>Loading...</p>
              ) : links.length === 0 ? (
                <p>No portal links found. Create one to get started.</p>
              ) : (
                <div className="space-y-2">
                  {links.map((link) => (
                    <div key={link._id}>
                      {editingId === link._id ? (
                        // --- EDITING VIEW ---
                        <div className="flex flex-col gap-3 rounded-md border p-4 bg-muted/50">
                            <div className="flex items-center justify-between">
                                 <p className="text-sm font-medium text-muted-foreground">{link.portalName}</p>
                                 <Input
                                    value={editingLinkValue}
                                    onChange={(e) => setEditingLinkValue(e.target.value)}
                                    className="max-w-xs"
                                    placeholder="Enter new link URL"
                                    />
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-2">
                                <Button size="sm" variant="outline" onClick={handleUpdateSubmit} disabled={isLoading}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {isLoading ? 'Saving...' : 'Save'}
                                </Button>
                                <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                                    <X className="h-4 w-4 mr-2"/>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                      ) : (
                        // --- DISPLAY VIEW (Styled like the image) ---
                        <div className="flex items-center justify-between border-b py-3 group">
                           <div>
                             <p className="text-sm font-medium text-muted-foreground">{link.portalName}</p>
                             <p className="text-sm font-semibold">{link.link}</p>
                           </div>
                           <Button 
                             size="icon" 
                             variant="ghost"
                             onClick={() => handleEditClick(link)}
                             className="opacity-0 group-hover:opacity-100 transition-opacity"
                             aria-label={`Edit ${link.portalName}`}
                           >
                              <Edit className="h-4 w-4"/>
                           </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}