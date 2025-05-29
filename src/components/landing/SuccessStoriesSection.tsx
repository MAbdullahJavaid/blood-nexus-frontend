
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Heart, Calendar, MapPin } from 'lucide-react';

const SuccessStoriesSection = () => {
  const stories = [
    {
      id: 1,
      name: "Little Zara's Recovery",
      age: "5 years old",
      condition: "Thalassemia Major",
      story: "Zara has been receiving regular blood transfusions for 3 years. Today, she's a healthy, energetic child who loves to paint and dreams of becoming a doctor.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2069&auto=format&fit=crop",
      location: "Karachi",
      date: "March 2024"
    },
    {
      id: 2,
      name: "Ahmed's New Life",
      age: "28 years old",
      condition: "Accident Victim",
      story: "After a severe accident, Ahmed needed multiple blood transfusions. Thanks to our donors, he made a full recovery and returned to his family.",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=2074&auto=format&fit=crop",
      location: "Lahore",
      date: "February 2024"
    },
    {
      id: 3,
      name: "Fatima's Fight",
      age: "12 years old",
      condition: "Leukemia",
      story: "During her cancer treatment, Fatima needed regular platelet transfusions. She's now in remission and back to school with her friends.",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop",
      location: "Islamabad",
      date: "January 2024"
    },
    {
      id: 4,
      name: "Baby Hassan's Miracle",
      age: "6 months old",
      condition: "Premature Birth Complications",
      story: "Born premature with severe anemia, baby Hassan's life was saved through immediate blood transfusions. He's now a healthy, growing baby.",
      image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=2043&auto=format&fit=crop",
      location: "Peshawar",
      date: "April 2024"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Success <span className="text-blood-DEFAULT">Stories</span>
          </h2>
          <div className="w-20 h-1 bg-blood-DEFAULT rounded-full mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real stories of hope, recovery, and new beginnings made possible by the generosity of our donors
          </p>
        </div>

        {/* Stories Carousel */}
        <div className="max-w-6xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent className="-ml-4">
              {stories.map((story) => (
                <CarouselItem key={story.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={story.image} 
                        alt={story.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <div className="bg-blood-DEFAULT text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Success Story
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-center mb-3">
                        <Heart className="h-5 w-5 text-blood-DEFAULT mr-2" />
                        <h3 className="text-xl font-bold text-gray-800">{story.name}</h3>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Age:</span> {story.age}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Condition:</span> {story.condition}
                        </div>
                      </div>

                      <p className="text-gray-600 leading-relaxed mb-4">
                        {story.story}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {story.location}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {story.date}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Your Story Could Be Next
            </h3>
            <p className="text-gray-600 mb-6">
              Every donation creates a story of hope. Join our mission and help write more success stories.
            </p>
            <button className="bg-blood-DEFAULT hover:bg-blood-dark text-white px-8 py-3 rounded-full font-semibold transition-colors">
              Share Your Story
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;
