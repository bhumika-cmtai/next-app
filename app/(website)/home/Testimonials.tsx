"use client"
import Image from 'next/image';
import React, { useState, useEffect } from 'react';

// --- DATA ---
const testimonialsData = [
  {
    id: 1,
    text: "Grow up ek aisa platform hai jaha koi bhi apne sapne pure kar sakta hai maine kiye hai. Aaj ke time par koi bhi job ho ya busness bina investment ke kar hi nahi sakte but grow up ne ye trand chenge kiya hai thank you grow up management 👍",
    name: "Deepak",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
    nameColor: "text-red-500",
    borderColor: "border-red-500",
  },
  {
    id: 2,
    text: "First of all my name is Vicky. Grow Up is a trusted company which gives us various work opportunities. You can work from anywhere by just having your mobile and internet.",
    name: "Vicky",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1887&auto=format&fit=crop",
    nameColor: "text-purple-500",
    borderColor: "border-purple-500",
  },
  {
    id: 3,
    text: "This platform is a game-changer for anyone looking to earn from home. The tasks are straightforward and the payment is always on time. Highly recommended for students and homemakers.",
    name: "Priya",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop",
    nameColor: "text-blue-500",
    borderColor: "border-blue-500",
  },
  {
    id: 4,
    text: "The support team is amazing and always ready to help. I've been earning consistently for months now. This is the best work-from-home opportunity I've found.",
    name: "Rahul",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1887&auto=format&fit=crop",
    nameColor: "text-green-500",
    borderColor: "border-green-500",
  }
];

// --- MAIN COMPONENT ---
const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-slide functionality
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % testimonialsData.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying]);

  const goToSlide = (index:number) => {
    setCurrentSlide(index);
  };

  return (
    // FIX 1: Removed `overflow-hidden` from this section to prevent clipping the profile image.
    <section className="relative w-full py-10 md:py-20 md:px-4">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center md:text-left max-w-xl mx-auto md:mx-0 mb-16 md:mb-10 md:ml-10">
          <p className="text-base font-semibold text-gray-500 uppercase tracking-widest mb-4">TESTIMONIALS</p>
          <h2 className="text-4xl md:text-5xl w-[280px] md:w-[400px] font-bold text-wrap mx-auto md:mx-0">
            <span className="bg-gradient-to-r from-black via-purple-400 via-40% to-pink-200 bg-clip-text text-transparent">What People Say </span>
            <span className=" bg-gradient-to-r from-black to-purple-400 bg-clip-text text-transparent">About Us.</span>
          </h2>
        </div>

        <div 
          className="relative pb-28"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-in-out h-[460px]"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              
              {testimonialsData.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 md:mt-10 mx-auto ">
                  <div className="flex justify-center items-center pb-10">
                    <div className="relative max-w-xl w-full ">
                      {/* Testimonial Card */}
                      <div className="relative md:-top-6 md:left-24  md:w-[460px] h-[260px] md:h-[200px] bg-white rounded-2xl shadow-md md:shadow-lg p-6 md:p-4 z-20 hover:shadow-xl transition-shadow duration-300">
                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                          {testimonial.text}
                        </p>
                        <p className={`mt-6 font-bold ${testimonial.nameColor}`}>{testimonial.name}</p>
                        <div className="absolute -bottom-12 left-[170px] lg:-bottom-16 md:left-1/2 transform -translate-x-1/2 ">
                        <Image 
                        alt='down arrow'
                        src="/arrow-down.png"
                        width={100}
                        height={100}
                        className='w-[60px] lg:w-[100px] h-auto object-contain'
                        />
                        </div>
                      </div>

                      {/* Profile Image */}
                      <div className="absolute left-[165px] -bottom-28 md:left-[320px] transform -translate-x-1/2 z-20 ">
                          <div className={`w-16 h-16 rounded-full overflow-hidden border-2 bg-white ${testimonial.borderColor}`}>
                              <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="w-full h-full object-cover rounded-full"
                              />
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
                
              ))}
            </div>
            {/* The Pink Blob background */}
            <Image 
                alt="testimonial blob"
                src="/testimonial-blob2.png"
                width={600}
                height={430}
                className='hidden lg:absolute lg:block  lg:-top-[80px] lg:right-[250px] h-auto w-[600px] z-0'
            />
          </div>
          
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {testimonialsData.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-gray-900 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;