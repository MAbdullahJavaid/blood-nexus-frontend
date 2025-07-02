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

  // Scroll animation observer
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          entry.target.classList.remove('opacity-0', 'translate-y-8');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe all sections with scroll animation
    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach((el) => {
      el.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

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
      name: "AbuBakar Kamal",
      story: "I believe every person can make a difference. By donating blood, I want to bring hope and life to children who are bravely fighting their battles.",
      image: "/lovable-uploads/e51ddfef-e651-41e9-a437-0457ac0338c2.png",
      donations: "5+ donations"
    },
    {
      name: "Ali Hussnain",
      story: "I'm proud to be a regular donor. Each donation is my way of supporting children with blood disorders and giving them hope.",
      image: "/lovable-uploads/92a7b197-5179-4c60-b1b3-7998ebc97d44.png",
      donations: "8+ donations"
    },
    {
      name: "Ahmed Hassan", 
      story: "Seeing the impact of blood donation motivates me to keep giving. Together, we can change lives and create brighter futures.",
      image: "/lovable-uploads/598a61c9-0766-4378-81a0-7b46ee766a04.png",
      donations: "7+ donations"
    },
    {
      name: "Junaid",
      story: "I've been donating blood for over 10 years. Knowing that my donations help children with blood disorders fills my heart with joy. Every drop makes a difference.",
      image: "/lovable-uploads/4d14b0f7-5ff9-4a60-b530-403bb8afb485.png",
      donations: "9+ donations"
    },
    {
      name: "Usman", 
      story: "As a regular donor, I've seen firsthand how blood donations save lives. It's a small act that creates a huge impact for families in need.",
      image: "/lovable-uploads/da418146-fd5b-47bc-8447-d67059e38eee.png",
      donations: "6+ donations"
    },
    {
      name: "Usama",
      story: "I believe everyone deserves a chance at life. Through blood donation, I can be part of these children's success stories and their bright futures.",
      image: "/lovable-uploads/3fb86a0d-0fc2-4cff-a267-7455c70dd4e6.png",
      donations: "4+ donations"
    },
    {
      name: "Nayyer",
      story: "Donating blood is a gift of life. By giving, we create hope and healthier futures for children in need.",
      image: "/lovable-uploads/51ca8b54-9d1b-4f95-ab33-e606a913781d.png",
      donations: "3+ donations"
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

  const handleGetHelp = () => {
    // Navigate to contact page or show contact information
    toast({
      title: "Get Help",
      description: "For immediate assistance, call us at +92 3464688765 or email mabdullahjaved764@gmail.com",
    });
  };

  // WhatsApp floating action handler
  const handleWhatsAppClick = () => {
    // Open WhatsApp chat to the number in a new tab
    window.open("https://wa.me/923464688765", "_blank");
  };

  // Social media click handlers
  const handleFacebookClick = () => {
    window.open("https://www.facebook.com/share/16uBpj3jpj/", "_blank");
  };

  const handleInstagramClick = () => {
    window.open("https://www.instagram.com/abdullahjaved271?igsh=MWN1bXV3cHg5OTJzeg==", "_blank");
  };

  const handleTwitterClick = () => {
    window.open("https://x.com/MAbdullahJave13?t=ji8uo1ilmaE7J5AA1WVEvg&s=09", "_blank");
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
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white scroll-animate">
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
              className="bg-blood hover:bg-blood-dark text-white px-8 py-4 text-lg rounded-full hover-scale"
              onClick={handleDonate}
            >
              Donate Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-blood text-blood hover:bg-blood hover:text-white px-8 py-4 text-lg rounded-full hover-scale"
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
      <section id="about-section" className="py-20 bg-gray-50 scroll-animate">
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
              <div className="text-center hover-scale">
                <Users className="h-12 w-12 text-blood mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">500+ Children Helped</h3>
                <p className="text-gray-600">Lives transformed through our care</p>
              </div>
              <div className="text-center hover-scale">
                <Shield className="h-12 w-12 text-blood mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">100% Free Care</h3>
                <p className="text-gray-600">No family pays for treatment</p>
              </div>
              <div className="text-center hover-scale">
                <Heart className="h-12 w-12 text-blood mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                <p className="text-gray-600">Always here when you need us</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 scroll-animate">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover-scale">
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
      <section className="py-20 bg-gray-50 scroll-animate">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Patient Stories</h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale"
              >
                <ChevronLeft className="h-6 w-6 text-gray-600" />
              </button>
              <button 
                onClick={nextStory}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale"
              >
                <ChevronRight className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Donors Are Our Heroes */}
      <section className="py-20 scroll-animate">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Donors Are Our Heroes</h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="md:flex">
                    <div className="md:w-1/2">
                      <img 
                        src={donorStories[currentDonor].image}
                        alt={donorStories[currentDonor].name}
                        className="w-full h-64 md:h-full object-cover object-center"
                        style={{ aspectRatio: '1/1' }}
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
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale"
              >
                <ChevronLeft className="h-6 w-6 text-gray-600" />
              </button>
              <button 
                onClick={nextDonor}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale"
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
      <section className="py-20 bg-gray-50 scroll-animate">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">How You Can Help</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-all duration-300 hover-scale">
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
            <Card className="text-center hover:shadow-lg transition-all duration-300 hover-scale">
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
            <Card className="text-center hover:shadow-lg transition-all duration-300 hover-scale">
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
      <section className="py-20 scroll-animate">
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
                className="bg-blood hover:bg-blood-dark text-white px-8 py-3 rounded-full hover-scale"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-16 scroll-animate">
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
                <Facebook 
                  className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition-colors hover-scale" 
                  onClick={handleFacebookClick}
                />
                <Twitter 
                  className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition-colors hover-scale" 
                  onClick={handleTwitterClick}
                />
                <Instagram 
                  className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer transition-colors hover-scale" 
                  onClick={handleInstagramClick}
                />
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
                  onClick={handleGetHelp}
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
                  onClick={handleGetHelp}
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
          className="bg-green-500 hover:bg-green-600 text-white rounded-full px-5 py-4 shadow-lg hover:shadow-xl transition-all hover-scale flex items-center justify-center"
          style={{
            boxShadow: "0 2px 8px 0 rgba(0,150,0,0.18)",
          }}
          onClick={handleWhatsAppClick}
          aria-label="Chat on WhatsApp"
        >
          {/* Replace Whatsapp icon with Phone icon */}
          <Phone className="h-5 w-5" />
        </Button>
        <Button 
          size="lg"
          className="bg-blood hover:bg-blood-dark text-white rounded-full px-6 py-4 shadow-lg hover:shadow-xl transition-all hover-scale"
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
