import React, { useState, useEffect } from 'react';
import { adminApi } from '@/services/adminApi';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mail, Trash2, Check, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const AdminContacts = () => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => { fetchContacts(); }, []);

  const fetchContacts = async () => {
    try {
      const data = await adminApi.getContacts();
      setContacts(data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch contacts', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await adminApi.markContactRead(id);
      fetchContacts();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to mark as read', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await adminApi.deleteContact(id);
      toast({ title: 'Deleted', description: 'Message deleted' });
      fetchContacts();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  const handleExport = async () => {
    try {
      const data = await adminApi.exportData('contacts');
      const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contacts_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      toast({ title: 'Exported', description: `${data.count} contacts exported` });
    } catch (error) {
      toast({ title: 'Error', description: 'Export failed', variant: 'destructive' });
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-[#FF4500] border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Messages</h1>
          <p className="text-neutral-400">{contacts.filter(c => !c.is_read).length} unread of {contacts.length}</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="border-white/10 text-white">
          Export CSV
        </Button>
      </div>

      <div className="space-y-4">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className={`p-4 rounded-xl border transition-colors ${
              contact.is_read ? 'bg-neutral-900 border-white/10' : 'bg-neutral-900/80 border-[#FF4500]/30'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {!contact.is_read && <span className="w-2 h-2 rounded-full bg-[#FF4500]" />}
                  <span className="font-semibold text-white">{contact.name}</span>
                  <span className="text-neutral-500">{contact.email}</span>
                  {contact.phone && <span className="text-neutral-500">• {contact.phone}</span>}
                </div>
                {contact.service && (
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-white/5 text-neutral-400 mb-2">
                    {contact.service}
                  </span>
                )}
                <p className="text-neutral-300 line-clamp-2">{contact.message}</p>
                <p className="text-xs text-neutral-500 mt-2">{new Date(contact.created_at).toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setSelectedContact(contact)} className="border-white/10 text-white">
                  <Eye size={14} />
                </Button>
                {!contact.is_read && (
                  <Button size="sm" variant="outline" onClick={() => handleMarkRead(contact.id)} className="border-green-500/50 text-green-500">
                    <Check size={14} />
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => handleDelete(contact.id)} className="border-red-500/50 text-red-500">
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {contacts.length === 0 && (
          <div className="text-center py-12 text-neutral-500">
            <Mail className="mx-auto mb-4" size={48} />
            <p>No messages yet</p>
          </div>
        )}
      </div>

      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="bg-neutral-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Message from {selectedContact?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <span className="text-neutral-500">Email:</span>
              <a href={`mailto:${selectedContact?.email}`} className="ml-2 text-[#FF4500]">{selectedContact?.email}</a>
            </div>
            {selectedContact?.phone && (
              <div>
                <span className="text-neutral-500">Phone:</span>
                <span className="ml-2 text-white">{selectedContact?.phone}</span>
              </div>
            )}
            {selectedContact?.service && (
              <div>
                <span className="text-neutral-500">Service:</span>
                <span className="ml-2 text-white">{selectedContact?.service}</span>
              </div>
            )}
            <div>
              <span className="text-neutral-500">Message:</span>
              <p className="mt-2 text-white whitespace-pre-wrap">{selectedContact?.message}</p>
            </div>
            <div className="text-xs text-neutral-500">
              Received: {selectedContact && new Date(selectedContact.created_at).toLocaleString()}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminContacts;
