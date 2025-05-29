
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Users, Award, Globe } from 'lucide-react';

const AboutSection = () => {
  const stats = [
    { icon: Heart, number: '100,000+', label: 'Lives Saved', color: 'text-blood-DEFAULT' },
    { icon: Users, number: '50,000+', label: 'Active Donors', color: 'text-medical-DEFAULT' },
    { icon: Award, number: '25+', label: 'Years Experience', color: 'text-green-600' },
    { icon: Globe, number: '10+', label: 'Cities Served', color: 'text-purple-600' },
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop" 
              alt="Medical team helping patients"
              className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl">
              <div className="text-3xl font-bold text-blood-DEFAULT">25+</div>
              <div className="text-gray-600">Years of Trust</div>
            </div>
          </div>

          {/* Content Side */}
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                About <span className="text-blood-DEFAULT">Sundas Foundation</span>
              </h2>
              <div className="w-20 h-1 bg-blood-DEFAULT rounded-full"></div>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed">
              For over 25 years, Sundas Foundation has been a beacon of hope for thousands 
              of families across Pakistan. We are dedicated to providing free blood 
              transfusion services, thalassemia treatment, and comprehensive healthcare 
              support to those who need it most.
            </p>

            <p className="text-lg text-gray-600 leading-relaxed">
              Our mission extends beyond just medical care - we believe in creating 
              a community of compassionate donors and volunteers who understand that 
              every drop of blood can save a life.
            </p>

            {/* Mission Statement */}
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blood-DEFAULT">
              <h3 className="font-semibold text-xl mb-2 text-gray-800">Our Mission</h3>
              <p className="text-gray-600">
                To ensure that no life is lost due to lack of blood availability, 
                and to provide hope and healing to families in their darkest hours.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className={`inline-flex p-3 rounded-full bg-gray-100 mb-4`}>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
