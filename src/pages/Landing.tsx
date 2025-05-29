import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const Landing = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [currentStory, setCurrentStory] = useState(0);

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

  const donorImages = [
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1594824947633-d0501ba2fe65?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop"
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
            >
              Donate Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-blood text-blood hover:bg-blood hover:text-white px-8 py-4 text-lg rounded-full"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="py-20 bg-gray-50">
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
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Our Donors Are Our Heroes</h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Every donation makes a difference. Meet some of the incredible people who have opened their hearts 
            and given the gift of life to children in need.
          </p>
          
          {/* Main donor grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {donorImages.slice(0, 6).map((image, index) => (
              <div key={index} className="group relative">
                <div className="aspect-square rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <img 
                    src={image}
                    alt={`Donor ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Hero {index + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Second row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mt-8">
            {donorImages.slice(6, 10).map((image, index) => (
              <div key={index + 6} className="group relative">
                <div className="aspect-square rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <img 
                    src={image}
                    alt={`Donor ${index + 7}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Hero {index + 7}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating donor images */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full overflow-hidden shadow-lg animate-[float_6s_ease-in-out_infinite]">
            <img 
              src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop"
              alt="Floating donor 1"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-32 right-16 w-16 h-16 rounded-full overflow-hidden shadow-lg animate-[float_8s_ease-in-out_infinite_2s]">
            <img 
              src="https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=200&h=200&fit=crop"
              alt="Floating donor 2"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-20 left-20 w-24 h-24 rounded-full overflow-hidden shadow-lg animate-[float_7s_ease-in-out_infinite_1s]">
            <img 
              src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop"
              alt="Floating donor 3"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-32 right-12 w-18 h-18 rounded-full overflow-hidden shadow-lg animate-[float_9s_ease-in-out_infinite_3s]">
            <img 
              src="https://images.unsplash.com/photo-1594824947633-d0501ba2fe65?w=200&h=200&fit=crop"
              alt="Floating donor 4"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* How to Help */}
      <section className="py-20">
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
                <Button className="bg-blood hover:bg-blood-dark text-white rounded-full">
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
                <Button variant="outline" className="border-blood text-blood hover:bg-blood hover:text-white rounded-full">
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
                <Button variant="outline" className="border-blood text-blood hover:bg-blood hover:text-white rounded-full">
                  Organize Drive
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gray-50">
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
                <Facebook className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer" />
                <Twitter className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer" />
                <Instagram className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blood" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blood" />
                  <span>info@bloodcare.org</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-blood" />
                  <span>123 Care Street, Medical District</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <div className="hover:text-blood cursor-pointer">About Us</div>
                <div className="hover:text-blood cursor-pointer">Services</div>
                <div className="hover:text-blood cursor-pointer">Get Help</div>
                <div className="hover:text-blood cursor-pointer">Donate</div>
                <div className="hover:text-blood cursor-pointer">Contact</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Blood Care Foundation. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Sticky Donate Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          size="lg"
          className="bg-blood hover:bg-blood-dark text-white rounded-full px-6 py-4 shadow-lg hover:shadow-xl transition-all"
        >
          <Heart className="h-5 w-5 mr-2" />
          Donate
        </Button>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default Landing;
