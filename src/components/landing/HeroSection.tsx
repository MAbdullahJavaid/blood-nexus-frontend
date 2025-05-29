
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';

const HeroSection = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=2069&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in">
          Saving Lives with Every
          <span className="text-blood-light block">Drop of Hope</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto animate-fade-in">
          Join us in the mission to provide free blood and hope to those in need. 
          Together, we can make a difference in countless lives.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
          <Button 
            size="lg" 
            className="bg-blood-DEFAULT hover:bg-blood-dark text-white px-8 py-4 rounded-full font-semibold text-lg group"
          >
            Become a Donor
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-gray-800 px-8 py-4 rounded-full font-semibold text-lg group"
          >
            <Play className="mr-2 h-5 w-5" />
            Learn More
          </Button>
        </div>

        {/* Floating Statistics */}
        <div className="grid grid-cols-3 gap-8 mt-16 animate-fade-in">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blood-light">100K+</div>
            <div className="text-sm md:text-base opacity-80">Lives Touched</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blood-light">50K+</div>
            <div className="text-sm md:text-base opacity-80">Blood Units</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blood-light">25+</div>
            <div className="text-sm md:text-base opacity-80">Years of Service</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
