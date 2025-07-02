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
  const [newCommission, setNewCommission] = useState('');

  // State for inline editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLinkValue, setEditingLinkValue] = useState('');
  const [editingCommissionValue, setEditingCommissionValue] = useState('');

  useEffect(() => {
    dispatch(fetchAllLinks());
  }, [dispatch]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortalName || !newLink || !newCommission) {
      alert("All fields are required.");
      return;
    };

    const result = await dispatch(createPortalLink({
      portalName: newPortalName,
      link: newLink,
      commission: newCommission
    }));

    if (result) {
      // Clear the form on successful creation
      setNewPortalName('');
      setNewLink('');
      setNewCommission('');
    }
  };

  const handleEditClick = (link: PortalLink) => {
    setEditingId(link._id);
    setEditingLinkValue(link.link);
    // This correctly populates the edit form with the existing value
    setEditingCommissionValue(link.commission || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingLinkValue('');
    setEditingCommissionValue('');
  };

  const handleUpdateSubmit = async () => {
    if (!editingId) return;

    const result = await dispatch(updatePortalLink(editingId, {
      link: editingLinkValue,
      commission: editingCommissionValue
    }));

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
                <div className="space-y-2">
                  <Label htmlFor="commission">Commission</Label>
                  <Input
                    id="commission"
                    type="text"
                    placeholder="e.g. Rs. 100"
                    required
                    value={newCommission}
                    onChange={(e) => setNewCommission(e.target.value)}
                    disabled={isLoading}
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
                          <p className="text-sm font-medium text-muted-foreground">{link.portalName}</p>
                          <div className='space-y-2'>
                            <Label htmlFor={`edit-link-${link._id}`}>Link URL</Label>
                            <Input
                                id={`edit-link-${link._id}`}
                                value={editingLinkValue}
                                onChange={(e) => setEditingLinkValue(e.target.value)}
                                placeholder="Enter new link URL"
                            />
                          </div>
                          {/* **** EDIT COMMISSION **** */}
                          <div className='space-y-2'>
                            <Label htmlFor={`edit-commission-${link._id}`}>Commission</Label>
                            <Input
                                id={`edit-commission-${link._id}`}
                                value={editingCommissionValue} // This correctly uses the state
                                onChange={(e) => setEditingCommissionValue(e.target.value)}
                                placeholder="e.g., 5% or Rs. 10"
                            />
                          </div>
                          <div className="flex items-center justify-end gap-2 mt-2">
                            <Button size="sm" variant="outline" onClick={handleUpdateSubmit} disabled={isLoading}>
                              <Save className="h-4 w-4 mr-2" />
                              {isLoading ? 'Saving...' : 'Save'}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // --- DISPLAY VIEW ---
                        <div className="flex items-center justify-between border-b py-3 group">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">{link.portalName}</p>
                            <p className="text-sm font-semibold">{link.link}</p>
                            {/* **** DISPLAY COMMISSION **** */}
                            {link.commission && (
                              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                                Commission: {link.commission}
                              </p>
                            )}
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEditClick(link)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label={`Edit ${link.portalName}`}
                          >
                            <Edit className="h-4 w-4" />
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