"use client";
// Import useState and useEffect for the timer
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const Page = () => {
  const initialTimeInSeconds = 1 * 60;
  
  // 1. Set up state for the timer
  const [timeLeft, setTimeLeft] = useState(initialTimeInSeconds);

  useEffect(() => {
    // Set up an interval that decrements the time every second
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => {
        // When the timer is about to reach 0, reset it
        if (prevTime <= 1) {
          return initialTimeInSeconds;
        }
        // Otherwise, just decrement
        return prevTime - 1;
      });
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(timerId);
  }, []); // The empty dependency array [] ensures this effect runs only once

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <section
      // ✅ FIX: Removed `px-4` to allow child elements to be full-width.
      className="relative w-full z-10 py-4 mx-auto overflow-hidden"
      id="get-started"
    >
      {/* ✅ FIX: Added `px-4` here to ensure the card has padding on small screens. */}
      <div className="w-full flex justify-center px-4">
        <div className="relative w-full max-w-3xl flex flex-col items-center">
          
          {/* 4. Timer Display - Placed right above the card */}
          <div className="mb-4 text-center">
            <p className="text-xl font-bold text-red-600 animate-pulse">
              Time Left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds} mins
            </p>
          </div>
          
          <div className="w-full max-w-md mx-auto rounded-3xl p-[2px] bg-gradient-to-b from-[#A6F4C5] to-[#B6A7FF]">
            <div className="w-full h-full flex flex-col items-center gap-6 rounded-[22px] bg-white/90 backdrop-blur-sm p-6 md:p-10">
              {/* STEP - 1 JOIN WHATSAPP --> REGISTER FORM*/}
              <div className="w-full rounded-2xl p-[1.5px] bg-[linear-gradient(90deg,_#c6ffdd_0%,_#fbd786_50%,_#f7797d_100%)] bg-[length:200%_auto] transition-all duration-500 hover:bg-[position:100%_0] shadow-md hover:shadow-lg">
                <Link href="/registeration" className="flex w-full items-center  rounded-[14px] bg-white p-4">
                  <div className="flex-shrink-0">
                    <Image
                      src="/whatsapp.png"
                      width={48}
                      height={48}
                      alt="icon"
                      className="object-contain"
                    />
                  </div>
                  
                  <div className="text-center flex-grow">
                    <h2
                      className={`text-lg font-bold bg-gradient-to-r from-gray-700 to-green-400 bg-clip-text text-transparent`}
                    >
                      Step- 1
                    </h2>
                    <h3 className="text-xl text-center font-semibold text-gray-800">
                      Join Our WhatsApp Hub
                    </h3>
                  </div>
                </Link>
              </div>
              {/* STEP - 2 TEST LINK  */}
              <div className="w-full rounded-2xl p-[1.5px] bg-[linear-gradient(90deg,_#c6ffdd_0%,_#fbd786_50%,_#f7797d_100%)] bg-[length:200%_auto] transition-all duration-500 hover:bg-[position:100%_0] shadow-md hover:shadow-lg">
                <Link href="/test" className="flex w-full items-center  rounded-[14px] bg-white p-4">
                  <div className="flex-shrink-0">
                    <Image
                      src="/skillImg.png"
                      width={60}
                      height={60}
                      alt="assessment icon"
                      className="object-contain"
                    />
                  </div>
                   
                  <div className="text-center flex-grow">
                    <h2
                      className={`text-lg font-bold bg-gradient-to-r from-gray-700 to-gray-400 bg-clip-text text-transparent`}
                    >
                      Step- 2
                    </h2>
                    <h3 className="text-xl text-center font-semibold text-gray-800">
                      Test Link
                    </h3>
                  </div>
                </Link>
              </div>
              {/* STEP - 3 Access Franchise Link Channel   */}
              <div className="w-full rounded-2xl p-[1.5px] bg-[linear-gradient(90deg,_#c6ffdd_0%,_#fbd786_50%,_#f7797d_100%)] bg-[length:200%_auto] transition-all duration-500 hover:bg-[position:100%_0] shadow-md hover:shadow-lg">
                <Link href="/telegram" className="flex w-full items-center  rounded-[14px] bg-white p-4">
                  <div className="flex-shrink-0">
                    <Image
                      src="/telegram.png"
                      width={48}
                      height={48}
                      alt="telegram icon"
                      className="object-contain"
                    />
                  </div>
                   
                  <div className="text-center flex-grow">
                    <h2
                      className={`text-lg font-bold bg-gradient-to-r from-gray-700 to-blue-600 bg-clip-text text-transparent`}
                    >
                      Step- 3
                    </h2>
                    <h3 className="text-xl text-center font-semibold text-gray-800">
                      Access Franchise Link Channel
                    </h3>
                  </div>
                </Link>
              </div>
              {/* STEP - 4 Zoom Link   */}
              <div className="w-full rounded-2xl p-[1.5px] bg-[linear-gradient(90deg,_#c6ffdd_0%,_#fbd786_50%,_#f7797d_100%)] bg-[length:200%_auto] transition-all duration-500 hover:bg-[position:100%_0] shadow-md hover:shadow-lg">
                <Link href="/telegram" className="flex w-full items-center  rounded-[14px] bg-white p-4">
                  <div className="flex-shrink-0">
                    <Image
                      src="/zoom.png"
                      width={48}
                      height={48}
                      alt="zoom icon"
                      className="object-contain"
                    />
                  </div>
                   
                  <div className="text-center flex-grow">
                    <h2
                      className={`text-lg font-bold bg-gradient-to-r from-gray-700 to-blue-600 bg-clip-text text-transparent`}
                    >
                      Step- 4
                    </h2>
                    <h3 className="text-xl text-center font-semibold text-gray-800">
                      Zoom Link
                    </h3>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Security Illustration  */}
          <div className="absolute -bottom-16 -right-32 z-20 hidden lg:block">
            <Image
              src="/authImg.png" 
              alt="Security illustration"
              width={300}
              height={300}
              className="pointer-events-none"
            />
          </div>
        </div>

        {/* blob for right */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.2 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute block -right-[100px] top-[60px] lg:-top-[40px] lg:-right-[200px] h-[200px] w-[200px] lg:h-[460px] lg:w-[460px] bg-gradient-to-b from-purple-400 to-pink-200 rounded-full opacity-20"
        ></motion.div>
        {/* blob for left */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.2 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute block top-[260px] -left-[150px] lg:top-[240px] lg:-left-[240px] lg:h-[600px] h-[200px] w-[200px] lg:w-[600px] bg-gradient-to-b from-purple-400 to-pink-200 rounded-full opacity-20"
        ></motion.div>
      </div>

      {/* Legal Documents Section */}
      <div className="mt-10 w-full flex flex-col items-center justify-center gap-3">
        <div className="flex items-center gap-2">
            <Image
              src="/legalImg.png" 
              width={40}
              height={40}
              alt="Document icon"
              />
            <div className="text-lg font-semibold text-black">Legal Documents:</div>
           
        </div>
        {/* ✅ FIX: The border now correctly spans the full viewport width */}
        <div className="w-full border-t-[1px] border-t-black flex justify-center pt-4">
            
          {/* ✅ FIX: Added `px-4` to this container to give the text content padding */}
          <div className="flex flex-col gap-2 items-start px-4">
            <p className="text-left">PAN Card</p>
            <p className="text-left">Udyam Registration Certificate</p>
            <p className="text-left">GST Certificate</p>
            <p className="text-left"> <Link className="underline" href="/privacy-policy">Privacy-Policy</Link> | <Link className="underline" href="/terms-and-conditions">Terms and Conditions</Link> | 
            <Link href="https://www.instagram.com/growup_india_?igsh=MTIxeDZ5aDRqbjI5aA==" className="inline-flex items-center gap-1.5 underline ">Follow Us On Insta <Image src="/instagram.png" alt="instagram" width={16} height={16} className="w-4"/></Link></p>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Page;