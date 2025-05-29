
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'About Us', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Donate Blood', href: '#donate' },
    { name: 'Volunteer', href: '#volunteer' },
    { name: 'Success Stories', href: '#stories' },
    { name: 'Contact', href: '#contact' },
  ];

  const services = [
    'Blood Donation',
    'Platelet Apheresis',
    'Thalassemia Treatment',
    'Emergency Blood',
    'Awareness Programs',
    'Medical Support'
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', name: 'Facebook' },
    { icon: Twitter, href: '#', name: 'Twitter' },
    { icon: Instagram, href: '#', name: 'Instagram' },
    { icon: Youtube, href: '#', name: 'YouTube' },
  ];

  return (
    <footer id="contact" className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">Stay Connected with Our Mission</h3>
            <p className="text-gray-300 mb-6">
              Subscribe to our newsletter for updates on blood drives, success stories, and ways to help save lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email"
                className="bg-white text-gray-900 border-0"
              />
              <Button className="bg-blood-DEFAULT hover:bg-blood-dark px-8">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Organization Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-blood-DEFAULT p-2 rounded-full">
                <Heart className="h-6 w-6 text-white fill-current" />
              </div>
              <span className="text-xl font-bold">Sundas Foundation</span>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              For over 25 years, we've been dedicated to saving lives through blood donation, 
              thalassemia treatment, and comprehensive healthcare support.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.href}
                  className="bg-gray-800 p-2 rounded-full hover:bg-blood-DEFAULT transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-300 hover:text-blood-light transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index} className="text-gray-300">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blood-DEFAULT mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">
                    123 Medical Center Road,<br />
                    Karachi, Pakistan
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blood-DEFAULT flex-shrink-0" />
                <div>
                  <p className="text-gray-300">+92-21-1234-5678</p>
                  <p className="text-sm text-gray-400">24/7 Emergency Hotline</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blood-DEFAULT flex-shrink-0" />
                <div>
                  <p className="text-gray-300">info@sundasfoundation.org</p>
                  <p className="text-sm text-gray-400">General Inquiries</p>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="mt-6 p-4 bg-blood-DEFAULT rounded-lg">
              <h5 className="font-semibold mb-2">Emergency Blood Need?</h5>
              <p className="text-sm mb-2">Call our 24/7 hotline</p>
              <p className="text-lg font-bold">+92-21-BLOOD-HELP</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 Sundas Foundation. All rights reserved. | Saving lives, one drop at a time.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-blood-light transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blood-light transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-blood-light transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
