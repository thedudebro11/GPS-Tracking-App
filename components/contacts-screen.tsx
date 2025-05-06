"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Trash2, User, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type Contact = {
  id: string
  name: string
  phone: string
  email: string
}

export function ContactsScreen() {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: "1", name: "John Doe", phone: "+1 (555) 123-4567", email: "john@example.com" },
    { id: "2", name: "Jane Smith", phone: "+1 (555) 987-6543", email: "jane@example.com" },
  ])

  const [newContact, setNewContact] = useState<Omit<Contact, "id">>({
    name: "",
    phone: "",
    email: "",
  })

  const [dialogOpen, setDialogOpen] = useState(false)

  const handleAddContact = () => {
    if (contacts.length >= 3) {
      // Show upgrade prompt for premium
      return
    }

    if (newContact.name && (newContact.phone || newContact.email)) {
      setContacts([...contacts, { ...newContact, id: Date.now().toString() }])
      setNewContact({ name: "", phone: "", email: "" })
      setDialogOpen(false)
    }
  }

  const handleRemoveContact = (id: string) => {
    setContacts(contacts.filter((contact) => contact.id !== id))
  }

  return (
    <div className="flex flex-col h-full">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Emergency Contacts</h1>
        <p className="text-sm opacity-90 mt-1">
          Add up to 3 emergency contacts who will be notified in case of an emergency
        </p>
      </header>

      <main className="flex-1 p-4 space-y-4">
        {contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <User className="h-16 w-16 text-blue-200 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Contacts Added</h2>
            <p className="text-gray-500 mb-6">Add emergency contacts who will be notified when you trigger an alert</p>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Contact
                </Button>
              </DialogTrigger>
              <ContactDialog
                newContact={newContact}
                setNewContact={setNewContact}
                handleAddContact={handleAddContact}
              />
            </Dialog>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {contacts.map((contact) => (
                <Card key={contact.id} className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{contact.name}</h3>
                        <div className="text-sm text-gray-500 flex flex-col mt-1">
                          {contact.phone && (
                            <span className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {contact.phone}
                            </span>
                          )}
                          {contact.email && (
                            <span className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {contact.email}
                            </span>
                          )}
                        </div>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Contact</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove {contact.name} from your emergency contacts?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => handleRemoveContact(contact.id)}
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {contacts.length < 3 && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Contact ({contacts.length}/3)
                  </Button>
                </DialogTrigger>
                <ContactDialog
                  newContact={newContact}
                  setNewContact={setNewContact}
                  handleAddContact={handleAddContact}
                />
              </Dialog>
            )}

            {contacts.length >= 3 && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-blue-700">You've reached the limit of 3 contacts on the free plan.</p>
                  <Button variant="link" className="text-blue-700 p-0 h-auto mt-1">
                    Upgrade to Premium for unlimited contacts
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  )
}

function ContactDialog({
  newContact,
  setNewContact,
  handleAddContact,
}: {
  newContact: Omit<Contact, "id">
  setNewContact: React.Dispatch<React.SetStateAction<Omit<Contact, "id">>>
  handleAddContact: () => void
}) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Emergency Contact</DialogTitle>
        <DialogDescription>Add someone who should be notified in case of emergency.</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            placeholder="Contact name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={newContact.phone}
            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={newContact.email}
            onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
            placeholder="contact@example.com"
          />
        </div>
      </div>
      <DialogFooter>
        <Button
          onClick={handleAddContact}
          disabled={!newContact.name || (!newContact.phone && !newContact.email)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add Contact
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
