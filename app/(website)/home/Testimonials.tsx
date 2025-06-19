"use client"
import Image from 'next/image';
import React, { useState, useEffect } from 'react';

const testimonialsData = [
  {
    id: 1,
    text: "Grow up ek aisa platform hai jaha koi bhi apne sapne pure kar sakta hai maine kiye hai Aaj ke time par koi bhi job ho ya busness bina investment ke kar hi nahi sakte 👍",
    name: "Deepak",
    image: "/deepakImg.jpg",
    nameColor: "text-red-500",
    borderColor: "border-red-500",
  },
  {
    id: 2,
    text: "First of all my name is Vicky and I am the student of college. Grow Up is a trusted company that offers zero investment work opportunities. You can work from home using just a mobile and internet",
    name: "Vicky",
    image: "/vickyImg.jpg",
    nameColor: "text-purple-500",
    borderColor: "border-purple-500",
  },
  {
    id: 3,
    text: "🔹 Zero investment work hai, isme 💸 koi paisa nahi lagta.🔹 Main abhi 🎓 12th pass hoon aur mujhe isse bahut madad mili.🔹 Is kamai se 📱 maine naya phone bhi kharida hai.",
    name: "Kundan",
    image: "/kundanImg.jpg",
    nameColor: "text-blue-500",
    borderColor: "border-blue-500",
  },
  {
    id: 4,
    text: "Best platform I ever found Best thing is that there is no need to invest in fake stuff Genuine work and proper guidance provide by the company and again it's a zero investment platform",
    name: "Vishal",
    image: "/vishalImg.jpg",
    nameColor: "text-green-500",
    borderColor: "border-green-500",
  },
  {
    id: 5,
    text: "First of all I am a student of bsc I grats my decision to join grow up ✅ for financial freedom 💰  I work here and according to my experience this is a greatest platform I ever found .",
    name: "Neha",
    image: "/nehaImg.jpg",
    nameColor: "text-green-500",
    borderColor: "border-green-500",
  },
  {
    id: 6,
    text: "Hii sir Thank you so much 🥰 sir is plant from ko bata ni ke liye 😊 Haa sacha me kucha paisa nahi lagta or bahut ata plant hy or work from home hai 💕 mere paise bahut gaye but ab paise ja nahi rahe aa rahe hy",
    name: "Aprajita",
    image: "aprajitaImg.jpg",
    nameColor: "text-green-500",
    borderColor: "border-green-500",
  },
  {
    id: 7,
    text: "Hi mera name aprajita h or mai ak student hu mai yha sturdy k sath work from home kam v karti hu ye ak aisha plate fome h jaha p aapko zero investment p kam diya jata h grow up company aap k life ko grow kr dege🤩",
    name: "Shubham",
    image: "shubhamImg.jpg",
    nameColor: "text-green-500",
    borderColor: "border-green-500",
  },
  {
    id: 8,
    text: "Grow up is the best platform online where u can work online and earn money 😊 Mein college student hu mere sare kharche yaha ki earning se purre hote hai bs 4-5 hours work karta hu best hai yeh platform aur sir aur ma'am ka support bhi bhut hai ❤, payment bhi time pr milta hai",
    name: "Aakash",
    image: "akashImg.jpg",
    nameColor: "text-green-500",
    borderColor: "border-green-500",
  },
  {
    id: 9,
    text: "Thanks sir ♥ itna achha platform dene ke liye..Mai 2 months se work kar rha hu kaafi achha & genuine platform hai growup thankyou so much sir 🙏",
    name: "Bhawesh",
    image: "/bhaweshImg.jpg",
    nameColor: "text-green-500",
    borderColor: "border-green-500",
  }
];

const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;
  const newArray = [...array]; 
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex], newArray[currentIndex]];
  }

  return newArray;
};

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [randomizedTestimonials, setRandomizedTestimonials] = useState<typeof testimonialsData>([]);

  useEffect(() => {
    setRandomizedTestimonials(shuffleArray(testimonialsData));
  }, []);

  useEffect(() => {
    if (randomizedTestimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % randomizedTestimonials.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [randomizedTestimonials.length]); 

  const goToSlide = (index:number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative max-w-7xl py-10 md:px-4">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center md:text-left max-w-xl mx-auto md:mx-0 mb-16 md:mb-20 md:ml-10">
          <p className="text-base font-semibold text-gray-500 uppercase tracking-widest mb-4">TESTIMONIALS</p>
          <h2 className="text-4xl md:text-5xl w-[280px] md:w-[400px] font-bold text-wrap mx-auto md:mx-0">
            <span className="bg-gradient-to-r from-black via-purple-400 via-40% to-pink-200 bg-clip-text text-transparent uppercase">What People Say </span>
            <span className=" bg-gradient-to-r from-black to-purple-400 bg-clip-text text-transparent uppercase">About Us.</span>
          </h2>
        </div>

        <div className="relative pb-16 mb-10">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-in-out h-[460px]"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              
              {randomizedTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 md:mt-10 mx-auto py-10 z-10">
                  <div className="flex justify-center items-center pb-10">
                    <div className="relative max-w-xl w-full ">
                      <Image 
                      alt="testimonial blob"
                      src="/testimonial-blob2.png"
                      width={600}
                      height={430}
                      className='hidden lg:absolute lg:block lg:-top-[80px]  lg:left-0 h-auto w-[600px] z-0'
                  />
                      {/* Testimonial Card */}
                      <div className="relative md:-top-2 items-center left-1/2 -translate-x-1/2 md:translate-x-0 md:left-16 bg-white/90  md:w-[460px] w-[360px] md:h-[200px] rounded-2xl shadow-md md:shadow-lg p-6 md:p-4 z-20 hover:shadow-xl transition-shadow duration-300">
                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                          {testimonial.text}
                        </p>
                        <p className={`mt-6 font-bold ${testimonial.nameColor}`}>{testimonial.name}</p>
                        <div className="absolute -bottom-8 md:-bottom-12 left-1/2 lg:-bottom-16 md:left-1/2 transform -translate-x-1/2 ">
                        <Image 
                        alt='down arrow'
                        src="/arrow-down.png"
                        width={100}
                        height={100}
                        className='w-[40px] lg:w-[80px] h-auto object-contain'
                        />
                        </div>
                      </div>

                      {/* Profile Image */}
                      <div className="absolute left-1/2 -bottom-30 md:left-[290px] transform -translate-x-1/2 z-20 ">
                          <div className={`w-16 h-16 rounded-full overflow-hidden border-2 bg-white ${testimonial.borderColor}`}>
                              <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="w-full h-full object-cover rounded-full"
                              />
                          </div>
                      </div>
                    </div>
                    
                    {/* The Pink Blob in the bg */}
                  
                  </div>
                </div>
                
              ))}
            </div>

          </div>
          
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {randomizedTestimonials.map((_, index) => (
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