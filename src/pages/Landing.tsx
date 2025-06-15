import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Heart, 
  Users, 
  Shield, 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Stethoscope,
  UserCheck,
  Calendar
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import VolunteerModal from "@/components/modals/VolunteerModal";
import OrganizeDriveModal from "@/components/modals/OrganizeDriveModal";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

const Landing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [currentStory, setCurrentStory] = useState(0);
  const [currentDonor, setCurrentDonor] = useState(0);
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);

  // MODAL state for donating
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState(5000); // cents; default $50
  const [isLoadingDonation, setIsLoadingDonation] = useState(false);

  // Watch for donation result in URL and show toast
  useEffect(() => {
    // Parse the search params
    const params = new URLSearchParams(location.search);
    const result = params.get("donation");

    if (result === "success") {
      toast({
        title: "Thank you for your donation!",
        description: "Your support will help provide life-saving care to children.",
      });
    } else if (result === "canceled") {
      toast({
        title: "Donation canceled",
        description: "You canceled the donation process. No payment was made.",
        variant: "destructive",
      });
    }

    // Clean up the URL (remove the param if present)
    if (result) {
      const newParams = new URLSearchParams(location.search);
      newParams.delete("donation");
      const newUrl =
        location.pathname +
        (newParams.toString() ? `?${newParams.toString()}` : "");
      window.history.replaceState({}, "", newUrl);
    }
    // only run this effect on mount or when location.search changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const patientStories = [
    {
      name: "Ahmed, 8 years old",
      story: "Thanks to regular blood transfusions, Ahmed is now able to attend school and play with his friends. His smile lights up our center every visit.",
      image: "https://sundas.org/images/cause_1.jpg?w=400&h=300&fit=crop"
    },
    {
      name: "Hamza, 12 years old", 
      story: "Hamza's thalassemia is well-managed with our comprehensive care program. He dreams of becoming a doctor to help other children like himself.",
      image: "https://sundas.org/images/cause_2.jpg?w=400&h=300&fit=crop"
    },
    {
      name: "Omar, 6 years old",
      story: "Omar's hemophilia treatment has given him the freedom to be a normal, active child. His courage inspires everyone around him.",
      image: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&h=300&fit=crop"
    }
  ];

  const donorStories = [
    {
      name: "Sarah Johnson",
      story: "I've been donating blood for over 10 years. Knowing that my donations help children with blood disorders fills my heart with joy. Every drop makes a difference.",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop",
      donations: "50+ donations"
    },
    {
      name: "Michael Chen", 
      story: "As a regular donor, I've seen firsthand how blood donations save lives. It's a small act that creates a huge impact for families in need.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      donations: "75+ donations"
    },
    {
      name: "Emma Rodriguez",
      story: "Donating blood is my way of giving back to the community. When I think about the children who receive this gift of life, it motivates me to continue.",
      image: "https://images.unsplash.com/photo-1494725176-7c40e5a71c5e?w=400&h=300&fit=crop",
      donations: "30+ donations"
    },
    {
      name: "David Thompson",
      story: "I started donating after learning about thalassemia. These brave children inspire me to be a regular donor and advocate for blood donation awareness.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop",
      donations: "40+ donations"
    },
    {
      name: "Lisa Williams",
      story: "Every time I donate, I remember that somewhere a child is getting a chance at a normal life. It's the most rewarding feeling in the world.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop",
      donations: "60+ donations"
    },
    {
      name: "James Miller",
      story: "Being a blood donor has taught me the true meaning of compassion. These children are fighters, and I'm honored to support their journey.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop",
      donations: "25+ donations"
    },
    {
      name: "Maria Garcia",
      story: "I believe everyone deserves a chance at life. Through blood donation, I can be part of these children's success stories and their bright futures.",
      image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=300&fit=crop",
      donations: "35+ donations"
    },
    {
      name: "Robert Davis",
      story: "Donating blood is more than just giving; it's about creating hope. Every donation brings these brave children one step closer to their dreams.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=300&fit=crop",
      donations: "45+ donations"
    }
  ];

  const services = [
    {
      icon: Droplets,
      title: "Blood Transfusion",
      description: "Safe, regular blood transfusions for children with thalassemia and other blood disorders"
    },
    {
      icon: Stethoscope,
      title: "Medical Diagnosis",
      description: "Comprehensive testing and diagnosis for genetic blood disorders using modern equipment"
    },
    {
      icon: UserCheck,
      title: "Genetic Counseling",
      description: "Expert guidance for families dealing with hereditary blood conditions"
    },
    {
      icon: Calendar,
      title: "Regular Monitoring",
      description: "Ongoing health monitoring and treatment adjustments for optimal patient care"
    }
  ];

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Thank you for subscribing!",
        description: "You'll receive updates about our mission and how you can help.",
      });
      setEmail("");
    }
  };

  const nextStory = () => {
    setCurrentStory((prev) => (prev + 1) % patientStories.length);
  };

  const prevStory = () => {
    setCurrentStory((prev) => (prev - 1 + patientStories.length) % patientStories.length);
  };

  const nextDonor = () => {
    setCurrentDonor((prev) => (prev + 1) % donorStories.length);
  };

  const prevDonor = () => {
    setCurrentDonor((prev) => (prev - 1 + donorStories.length) % donorStories.length);
  };

  const handleDonate = () => {
    setIsDonateModalOpen(true);
    setDonationAmount(5000); // Reset to default $50 if opened again
  };

  const payDonationAmount = async () => {
    setIsLoadingDonation(true);
    try {
      const amount = Number(donationAmount);
      if (!amount || amount < 100) {
        toast({
          title: "Invalid amount",
          description: "Please enter a valid donation amount (minimum $1).",
          variant: "destructive",
        });
        setIsLoadingDonation(false);
        return;
      }
      const redirectOrigin =
        window.location.origin || "http://localhost:3000";
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: { amount, currency: "usd", redirectOrigin },
      });

      if (error) {
        toast({
          title: "Error connecting to payment gateway",
          description: error.message || "Please try again later.",
          variant: "destructive",
        });
        setIsLoadingDonation(false);
        return;
      }

      if (data?.url) {
        window.open(data.url, "_blank");
        setIsDonateModalOpen(false);
      } else {
        toast({
          title: "Error launching Stripe checkout",
          description: "Unable to start payment session. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error launching Stripe checkout",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingDonation(false);
    }
  };

  const handleVolunteer = () => {
    setIsVolunteerModalOpen(true);
  };

  const handleOrganizeDrive = () => {
    setIsDriveModalOpen(true);
  };

  const handleLearnMore = () => {
    // Scroll to about section
    const aboutSection = document.querySelector('#about-section');
    aboutSection?.scrollIntoView({ behavior: 'smooth' });
  };

  // WhatsApp floating action handler
  const handleWhatsAppClick = () => {
    // Open WhatsApp chat to the number in a new tab
    window.open("https://wa.me/923464688765", "_blank");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-blood" />
            <span className="text-xl font-bold text-gray-800">Blood Care Foundation</span>
          </div>
          <Button 
            onClick={() => navigate("/login")}
            variant="outline"
            className="border-blood text-blood hover:bg-blood hover:text-white"
          >
            Management Login
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&h=1080&fit=crop')"
          }}
        />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight">
            Every Drop Counts,<br />
            <span className="text-blood">Every Life Matters</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Providing free medical care and blood transfusion services to children 
            suffering from genetic blood disorders like thalassemia and hemophilia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-blood hover:bg-blood-dark text-white px-8 py-4 text-lg rounded-full"
              onClick={handleDonate}
            >
              Donate Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-blood text-blood hover:bg-blood hover:text-white px-8 py-4 text-lg rounded-full"
              onClick={handleLearnMore}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* DONATE MODAL */}
      <Dialog open={isDonateModalOpen} onOpenChange={setIsDonateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Donate to Support Children
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <label className="block mb-2 font-medium text-gray-700">
              Donation Amount (USD)
            </label>
            <Input
              type="number"
              min={1}
              step={1}
              value={donationAmount ? (donationAmount / 100).toString() : ""}
              onChange={e => {
                // keep value in cents internally
                const value = e.target.value;
                setDonationAmount(Number(value) * 100);
              }}
              className="rounded-md px-4 py-3 text-xl border border-gray-300"
              placeholder="Enter amount (e.g., 50)"
              disabled={isLoadingDonation}
            />
            <div className="text-xs text-gray-500 mt-2">
              Minimum amount is $1. All proceeds go to children with blood disorders.
            </div>
          </div>
          <DialogFooter>
            <Button 
              className="bg-blood text-white rounded-full px-6" 
              onClick={payDonationAmount}
              disabled={isLoadingDonation}
            >
              {isLoadingDonation ? "Processing..." : "Proceed to Donate"}
            </Button>
            <Button variant="ghost" onClick={() => setIsDonateModalOpen(false)} disabled={isLoadingDonation}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* About Us */}
      <section id="about-section" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">About Our Mission</h2>
            <p className="text-lg text-gray-600 mb-8">
              We are dedicated to providing comprehensive, free medical care to children 
              suffering from genetic blood disorders. Our mission is to ensure that every 
              child has access to life-saving treatments regardless of their family's 
              financial situation.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <Users className="h-12 w-12 text-blood mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">500+ Children Helped</h3>
                <p className="text-gray-600">Lives transformed through our care</p>
              </div>
              <div className="text-center">
                <Shield className="h-12 w-12 text-blood mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">100% Free Care</h3>
                <p className="text-gray-600">No family pays for treatment</p>
              </div>
              <div className="text-center">
                <Heart className="h-12 w-12 text-blood mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                <p className="text-gray-600">Always here when you need us</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <service.icon className="h-12 w-12 text-blood mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Patient Stories */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Patient Stories</h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="md:flex">
                    <div className="md:w-1/2">
                      <img 
                        src={patientStories[currentStory].image}
                        alt={patientStories[currentStory].name}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-1/2 p-8 flex flex-col justify-center">
                      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                        {patientStories[currentStory].name}
                      </h3>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {patientStories[currentStory].story}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <button 
                onClick={prevStory}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
              >
                <ChevronLeft className="h-6 w-6 text-gray-600" />
              </button>
              <button 
                onClick={nextStory}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
              >
                <ChevronRight className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Donors Are Our Heroes */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Donors Are Our Heroes</h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="md:flex">
                    <div className="md:w-1/2">
                      <img 
                        src={donorStories[currentDonor].image}
                        alt={donorStories[currentDonor].name}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-1/2 p-8 flex flex-col justify-center">
                      <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                        {donorStories[currentDonor].name}
                      </h3>
                      <p className="text-sm text-blood font-medium mb-4">
                        {donorStories[currentDonor].donations}
                      </p>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {donorStories[currentDonor].story}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <button 
                onClick={prevDonor}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
              >
                <ChevronLeft className="h-6 w-6 text-gray-600" />
              </button>
              <button 
                onClick={nextDonor}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
              >
                <ChevronRight className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
          <div className="text-center mt-12">
            <p className="text-2xl font-semibold text-blood">
              Donate blood, save life
            </p>
          </div>
        </div>
      </section>

      {/* How to Help */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">How You Can Help</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Heart className="h-16 w-16 text-blood mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-4">Donate</h3>
                <p className="text-gray-600 mb-6">
                  Your financial contribution directly funds treatments and saves lives.
                </p>
                <Button 
                  className="bg-blood hover:bg-blood-dark text-white rounded-full"
                  onClick={handleDonate}
                >
                  Donate Now
                </Button>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Users className="h-16 w-16 text-blood mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-4">Volunteer</h3>
                <p className="text-gray-600 mb-6">
                  Join our team and make a direct impact in children's lives.
                </p>
                <Button 
                  variant="outline" 
                  className="border-blood text-blood hover:bg-blood hover:text-white rounded-full"
                  onClick={handleVolunteer}
                >
                  Get Involved
                </Button>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Droplets className="h-16 w-16 text-blood mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-4">Blood Drive</h3>
                <p className="text-gray-600 mb-6">
                  Organize a blood drive in your community or workplace.
                </p>
                <Button 
                  variant="outline" 
                  className="border-blood text-blood hover:bg-blood hover:text-white rounded-full"
                  onClick={handleOrganizeDrive}
                >
                  Organize Drive
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Stay Connected</h2>
            <p className="text-lg text-gray-600 mb-8">
              Subscribe to our newsletter for updates on our mission and ways you can help.
            </p>
            <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-full px-6 py-3"
                required
              />
              <Button 
                type="submit"
                className="bg-blood hover:bg-blood-dark text-white px-8 py-3 rounded-full"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-8 w-8 text-blood" />
                <span className="text-xl font-bold">Blood Care Foundation</span>
              </div>
              <p className="text-gray-300 mb-4">
                Dedicated to providing free medical care to children with genetic blood disorders.
              </p>
              <div className="flex gap-4">
                <Facebook className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Instagram className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blood" />
                  <span>+92 3464688765</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blood" />
                  <span>mabdullahjaved764@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-blood" />
                  <span>123 Care Street, Gujranwala</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <div 
                  className="hover:text-blood cursor-pointer transition-colors"
                  onClick={handleLearnMore}
                >
                  About Us
                </div>
                <div 
                  className="hover:text-blood cursor-pointer transition-colors"
                  onClick={() => document.querySelector('#services-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Services
                </div>
                <div 
                  className="hover:text-blood cursor-pointer transition-colors"
                  onClick={() => navigate('/contact')}
                >
                  Get Help
                </div>
                <div 
                  className="hover:text-blood cursor-pointer transition-colors"
                  onClick={handleDonate}
                >
                  Donate
                </div>
                <div 
                  className="hover:text-blood cursor-pointer transition-colors"
                  onClick={() => navigate('/contact')}
                >
                  Contact
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Blood Care Foundation. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Sticky Donate Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* WhatsApp floating button (appears above Donate, slides in similar location) */}
        <Button
          size="lg"
          className="bg-green-500 hover:bg-green-600 text-white rounded-full px-5 py-4 shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
          style={{
            boxShadow: "0 2px 8px 0 rgba(0,150,0,0.18)",
          }}
          onClick={handleWhatsAppClick}
          aria-label="Chat on WhatsApp"
        >
          <WhatsAppIcon size={20} />
        </Button>
        <Button 
          size="lg"
          className="bg-blood hover:bg-blood-dark text-white rounded-full px-6 py-4 shadow-lg hover:shadow-xl transition-all"
          onClick={handleDonate}
        >
          <Heart className="h-5 w-5 mr-2" />
          Donate
        </Button>
      </div>

      {/* Volunteer Modal */}
      <VolunteerModal 
        isOpen={isVolunteerModalOpen}
        onClose={() => setIsVolunteerModalOpen(false)}
      />

      {/* Organize Drive Modal */}
      <OrganizeDriveModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
      />

    </div>
  );
};

export default Landing;
