
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface OrganizeDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrganizeDriveModal: React.FC<OrganizeDriveModalProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    contact_name: "",
    contact_email: "",
    phone: "",
    org_name: "",
    date_preference: "",
    location: "",
    additional_info: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!form.contact_name || !form.contact_email || !form.phone || !form.location) {
      toast({
        title: "Missing required fields",
        description: "Please fill in your name, email, phone, and location.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const date_for_db = form.date_preference && form.date_preference.length > 0
      ? form.date_preference
      : null;

    const { error } = await supabase
      .from("blood_drive_requests")
      .insert([
        {
          contact_name: form.contact_name,
          contact_email: form.contact_email,
          phone: form.phone,
          org_name: form.org_name || null,
          date_preference: date_for_db,
          location: form.location,
          additional_info: form.additional_info || null,
        }
      ]);

    setLoading(false);
    if (error) {
      toast({
        title: "Error submitting request",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Blood drive request submitted!",
        description: "Our team will reach out to you shortly. Thank you for supporting the mission.",
      });
      setForm({
        contact_name: "",
        contact_email: "",
        phone: "",
        org_name: "",
        date_preference: "",
        location: "",
        additional_info: "",
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Organize a Blood Drive</DialogTitle>
          <DialogDescription>
            Would you like to organize a blood drive at your school, company, or community center? Fill out the form below and our team will contact you soon.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-0 h-full">
          {/* Scrollable form fields */}
          <div className="flex-1 overflow-y-auto space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="contact_name">Your Name *</label>
              <Input id="contact_name" name="contact_name" value={form.contact_name} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="contact_email">Email *</label>
              <Input id="contact_email" name="contact_email" type="email" value={form.contact_email} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="phone">Phone *</label>
              <Input id="phone" name="phone" value={form.phone} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="org_name">Organization Name</label>
              <Input id="org_name" name="org_name" value={form.org_name} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="date_preference">Preferred Date</label>
              <Input id="date_preference" name="date_preference" type="date" value={form.date_preference} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="location">Location *</label>
              <Input id="location" name="location" value={form.location} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="additional_info">Additional Information</label>
              <Textarea id="additional_info" name="additional_info" value={form.additional_info} onChange={handleChange} />
            </div>
          </div>
          {/* Sticky footer */}
          <div className="sticky bottom-0 left-0 w-full bg-white/95 border-t border-gray-200 px-0 py-4 z-10 flex gap-2">
            <Button type="submit" className="bg-blood text-white min-w-[120px]" disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="ghost" className="min-w-[100px]">
                Cancel
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrganizeDriveModal;
