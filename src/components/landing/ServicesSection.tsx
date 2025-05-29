
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets, Heart, Stethoscope, Megaphone } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      icon: Droplets,
      title: 'Blood Donation',
      description: 'Safe and professional blood collection with state-of-the-art equipment and trained medical staff.',
      image: 'https://images.unsplash.com/photo-1615461066159-fea0960485d5?q=80&w=2006&auto=format&fit=crop'
    },
    {
      icon: Heart,
      title: 'Platelet Apheresis',
      description: 'Specialized platelet donation procedures for patients with critical blood disorders and cancer treatment.',
      image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=2070&auto=format&fit=crop'
    },
    {
      icon: Stethoscope,
      title: 'Thalassemia Treatment',
      description: 'Comprehensive care and regular blood transfusions for thalassemia patients of all ages.',
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?q=80&w=2069&auto=format&fit=crop'
    },
    {
      icon: Megaphone,
      title: 'Awareness Campaigns',
      description: 'Educational programs to promote blood donation awareness and dispel myths in communities.',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=2074&auto=format&fit=crop'
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our <span className="text-blood-DEFAULT">Services</span>
          </h2>
          <div className="w-20 h-1 bg-blood-DEFAULT rounded-full mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive healthcare services designed to save lives and provide hope to families in need
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="bg-white p-3 rounded-full">
                    <service.icon className="h-6 w-6 text-blood-DEFAULT" />
                  </div>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-blood-DEFAULT transition-colors">
                  {service.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blood-DEFAULT to-blood-dark p-8 rounded-2xl text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Make a Difference?
            </h3>
            <p className="text-xl opacity-90 mb-6">
              Your donation can save up to three lives. Join our mission today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blood-DEFAULT px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                Schedule Donation
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blood-DEFAULT transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
