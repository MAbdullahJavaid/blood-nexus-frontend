
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Quote, Star } from 'lucide-react';

const WhyDonateSection = () => {
  const testimonials = [
    {
      name: "Ahmad Hassan",
      role: "Regular Donor",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop",
      quote: "Donating blood through Sundas Foundation gave my life purpose. Knowing that my donation helped save a child's life is the most rewarding feeling.",
      rating: 5
    },
    {
      name: "Fatima Khan",
      role: "Thalassemia Patient's Mother",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b898?q=80&w=2069&auto=format&fit=crop",
      quote: "Sundas Foundation has been our lifeline for 8 years. They've given my daughter a chance to live normally despite her condition.",
      rating: 5
    },
    {
      name: "Dr. Sarah Ahmed",
      role: "Medical Professional",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop",
      quote: "The quality of care and professionalism at Sundas Foundation is exceptional. They truly understand the value of every drop of blood.",
      rating: 5
    }
  ];

  const stats = [
    { number: "3", label: "Lives saved per donation" },
    { number: "15", label: "Minutes donation process" },
    { number: "56", label: "Days until next donation" },
    { number: "100%", label: "Safe and tested blood" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Why <span className="text-blood-DEFAULT">Donate?</span>
          </h2>
          <div className="w-20 h-1 bg-blood-DEFAULT rounded-full mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every donation makes a real difference. Here's what our community says about their experience.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl font-bold text-blood-DEFAULT mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Quote className="h-8 w-8 text-blood-DEFAULT mr-3" />
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
                
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-800">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Ready to Save Lives?
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of heroes who donate blood regularly. Your contribution can make the difference between life and death.
            </p>
            <button className="bg-blood-DEFAULT hover:bg-blood-dark text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors">
              Become a Life Saver Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyDonateSection;
