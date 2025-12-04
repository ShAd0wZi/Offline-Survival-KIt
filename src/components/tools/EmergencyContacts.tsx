import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, Trash2, Plus, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Contact {
  id: string;
  name: string;
  phone: string;
}

export const EmergencyContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('emergency-contacts');
    if (stored) {
      setContacts(JSON.parse(stored));
    }
  }, []);

  const saveContacts = (updatedContacts: Contact[]) => {
    localStorage.setItem('emergency-contacts', JSON.stringify(updatedContacts));
    setContacts(updatedContacts);
  };

  const addContact = () => {
    if (!newName || !newPhone) {
      toast({
        title: 'Missing Information',
        description: 'Please enter both name and phone number',
        variant: 'destructive'
      });
      return;
    }

    const contact: Contact = {
      id: Date.now().toString(),
      name: newName,
      phone: newPhone
    };

    saveContacts([...contacts, contact]);
    setNewName('');
    setNewPhone('');
    
    toast({
      title: 'Contact Added',
      description: `${newName} saved to emergency contacts`
    });
  };

  const deleteContact = (id: string) => {
    saveContacts(contacts.filter(c => c.id !== id));
    toast({
      title: 'Contact Removed',
      description: 'Emergency contact deleted'
    });
  };

  const callContact = (phone: string, name: string) => {
    window.location.href = `tel:${phone}`;
    toast({
      title: 'Calling',
      description: `Calling ${name}...`
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Phone className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold">Emergency Contacts</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-6">
        Store important emergency contacts for quick access (saved locally on your device)
      </p>

      {/* Contact List */}
      {contacts.length > 0 && (
        <div className="space-y-3 mb-6">
          {contacts.map(contact => (
            <div key={contact.id} className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <User className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <div className="font-bold">{contact.name}</div>
                <div className="text-sm text-muted-foreground">{contact.phone}</div>
              </div>
              <Button
                onClick={() => callContact(contact.phone, contact.name)}
                variant="default"
                size="sm"
              >
                <Phone className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => deleteContact(contact.id)}
                variant="ghost"
                size="sm"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add Contact Form */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="contact-name">Name</Label>
          <Input
            id="contact-name"
            placeholder="e.g., Family, Doctor, Friend"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="contact-phone">Phone Number</Label>
          <Input
            id="contact-phone"
            type="tel"
            placeholder="e.g., +1234567890"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
          />
        </div>
        <Button onClick={addContact} className="w-full" size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Add Emergency Contact
        </Button>
      </div>
    </Card>
  );
};
