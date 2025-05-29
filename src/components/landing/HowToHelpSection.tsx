
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Droplets, Users, DollarSign, Share2, ArrowRight } from 'lucide-react';

const HowToHelpSection = () => {
  const helpOptions = [
    {
      icon: Droplets,
      title: 'Become a Donor',
      description: 'Join our regular donor program and save lives with every donation. Safe, quick, and supervised by medical professionals.',
      action: 'Register Now',
      color: 'bg-blood-DEFAULT',
      hoverColor: 'hover:bg-blood-dark'
    },
    {
      icon: Users,
      title: 'Volunteer',
      description: 'Help us organize blood drives, assist patients, and spread awareness in your community. Your time makes a difference.',
      action: 'Join Us',
      color: 'bg-medical-DEFAULT',
      hoverColor: 'hover:bg-medical-dark'
    },
    {
      icon: DollarSign,
      title: 'Fund Us',
      description: 'Support our operations, equipment, and free treatment programs. Every contribution helps us save more lives.',
      action: 'Donate',
      color: 'bg-green-600',
      hoverColor: 'hover:bg-green-700'
    },
    {
      icon: Share2,
      title: 'Spread the Word',
      description: 'Share our mission on social media, organize awareness campaigns, and help us reach more potential donors.',
      action: 'Share Now',
      color: 'bg-purple-600',
      hoverColor: 'hover:bg-purple-700'
    }
  ];

  return (
    <section id="help" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            How Can You <span className="text-blood-DEFAULT">Help?</span>
          </h2>
          <div className="w-20 h-1 bg-blood-DEFAULT rounded-full mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            There are many ways to support our mission. Choose the one that fits your ability to help and make a lasting impact.
          </p>
        </div>

        {/* Help Options Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {helpOptions.map((option, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg overflow-hidden">
              <CardHeader className="text-center pb-4">
                <div className={`inline-flex p-4 rounded-full ${option.color} text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <option.icon className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-blood-DEFAULT transition-colors">
                  {option.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {option.description}
                </p>
                
                <Button 
                  className={`${option.color} ${option.hoverColor} text-white px-6 py-2 rounded-full font-semibold group w-full`}
                >
                  {option.action}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Emergency Contact Section */}
        <div className="bg-gradient-to-r from-blood-DEFAULT to-blood-dark rounded-2xl p-8 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">Emergency Blood Need?</h3>
          <p className="text-xl opacity-90 mb-6">
            Contact our 24/7 emergency hotline for urgent blood requirements
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="text-2xl font-bold">📞 +92-21-1234-5678</div>
            <Button className="bg-white text-blood-DEFAULT hover:bg-gray-100 px-8 py-3 rounded-full font-semibold">
              Call Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToHelpSection;
