
import React from 'react';
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import AboutSection from '@/components/landing/AboutSection';
import ServicesSection from '@/components/landing/ServicesSection';
import WhyDonateSection from '@/components/landing/WhyDonateSection';
import HowToHelpSection from '@/components/landing/HowToHelpSection';
import SuccessStoriesSection from '@/components/landing/SuccessStoriesSection';
import Footer from '@/components/landing/Footer';

const SundasLanding = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <WhyDonateSection />
      <HowToHelpSection />
      <SuccessStoriesSection />
      <Footer />
    </div>
  );
};

export default SundasLanding;
