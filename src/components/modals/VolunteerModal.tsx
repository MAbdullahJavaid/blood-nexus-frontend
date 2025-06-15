
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Heart, User, Mail, Phone, MapPin, Calendar } from "lucide-react";

interface VolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VolunteerModal = ({ isOpen, onClose }: VolunteerModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    age: "",
    occupation: "",
    experience: "",
    availability: "",
    interests: "",
    motivation: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Application Submitted Successfully!",
      description: "Thank you for your interest in volunteering. Our team will contact you within 48 hours.",
    });

    // Reset form and close modal
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      age: "",
      occupation: "",
      experience: "",
      availability: "",
      interests: "",
      motivation: ""
    });
    
    setIsSubmitting(false);
    onClose();
  };

  const isFormValid = formData.name && formData.email && formData.phone && formData.motivation;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl text-blood">
            <Heart className="h-6 w-6" />
            Volunteer Application
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-blood" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  placeholder="Enter your age"
                  min="16"
                  max="100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter your address"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                value={formData.occupation}
                onChange={(e) => handleInputChange("occupation", e.target.value)}
                placeholder="Enter your occupation"
              />
            </div>
          </div>

          {/* Volunteer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blood" />
              Volunteer Information
            </h3>

            <div>
              <Label htmlFor="availability">Availability</Label>
              <Select onValueChange={(value) => handleInputChange("availability", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekdays">Weekdays</SelectItem>
                  <SelectItem value="weekends">Weekends</SelectItem>
                  <SelectItem value="both">Both Weekdays & Weekends</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="interests">Areas of Interest</Label>
              <Select onValueChange={(value) => handleInputChange("interests", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your area of interest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient-care">Patient Care & Support</SelectItem>
                  <SelectItem value="blood-drives">Blood Drive Organization</SelectItem>
                  <SelectItem value="admin">Administrative Support</SelectItem>
                  <SelectItem value="fundraising">Fundraising Events</SelectItem>
                  <SelectItem value="awareness">Community Awareness</SelectItem>
                  <SelectItem value="medical">Medical Assistance</SelectItem>
                  <SelectItem value="transport">Transportation Support</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="experience">Previous Volunteer Experience</Label>
              <Textarea
                id="experience"
                value={formData.experience}
                onChange={(e) => handleInputChange("experience", e.target.value)}
                placeholder="Describe any previous volunteer experience (optional)"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="motivation">Why do you want to volunteer with us? *</Label>
              <Textarea
                id="motivation"
                value={formData.motivation}
                onChange={(e) => handleInputChange("motivation", e.target.value)}
                placeholder="Tell us what motivates you to volunteer with our organization"
                rows={4}
                required
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blood hover:bg-blood-dark text-white"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VolunteerModal;
