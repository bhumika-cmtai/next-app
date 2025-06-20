"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";


const Page = () => {
  return (
    <section
      className="max-w-7xl w-full relative z-10 px-4 py-4 mx-auto"
      id="get-started"
    >
      <div className="w-full flex justify-center">
        <div className="relative w-full max-w-3xl">
          <div className="w-full max-w-xl mx-auto rounded-3xl p-[2px] bg-gradient-to-b from-[#A6F4C5] to-[#B6A7FF]">
            <div className="w-full h-full flex flex-col items-center gap-6 rounded-[22px] bg-white/90 backdrop-blur-sm p-6 md:p-10">
              {/* STEP - 1 JOIN WHATSAPP --> REGISTER FORM*/}
              <div className="w-full rounded-2xl p-[1.5px] bg-[linear-gradient(90deg,_#c6ffdd_0%,_#fbd786_50%,_#f7797d_100%)] bg-[length:200%_auto] transition-all duration-500 hover:bg-[position:100%_0] shadow-md hover:shadow-lg">
                <div className="flex w-full items-center gap-4 rounded-[14px] bg-white p-4">
                  <div className="flex-shrink-0">
                    <Image
                      src="/whatsapp.png"
                      width={48}
                      height={48}
                      alt="icon"
                      className="object-contain"
                    />
                  </div>
                  <div className="text-center  ">
                    <h2
                      className={`text-lg font-bold bg-gradient-to-r from-gray-700 to-green-400 bg-clip-text text-transparent`}
                    >
                      Step- 1
                    </h2>
                    <h3 className="text-xl text-center font-semibold text-gray-800">
                      Join Our WhatsApp Hub
                    </h3>
                  </div>
                </div>
              </div>
              {/* STEP - 2 JOIN ZOOM MEET --> JOIN MEETING LINK*/}
              <div className="w-full rounded-2xl p-[1.5px] bg-[linear-gradient(90deg,_#c6ffdd_0%,_#fbd786_50%,_#f7797d_100%)] bg-[length:200%_auto] transition-all duration-500 hover:bg-[position:100%_0] shadow-md hover:shadow-lg">
                <div className="flex w-full items-center gap-4 rounded-[14px] bg-white p-4">
                  <div className="flex-shrink-0">
                    <Image
                      src="/zoom.png"
                      width={48}
                      height={48}
                      alt="zoom icon"
                      className="object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <h2
                      className={`text-lg font-bold bg-gradient-to-r from-gray-700 to-blue-400 bg-clip-text text-transparent`}
                    >
                      Step- 2
                    </h2>
                    <h3 className="text-xl text-center font-semibold text-gray-800">
                      Join Us On Zoom
                    </h3>
                  </div>
                </div>
              </div>
              {/* STEP - 3 QUICK SKILL UNLOCK (TEST) --> GIVE TEST ?  */}
              <div className="w-full rounded-2xl p-[1.5px] bg-[linear-gradient(90deg,_#c6ffdd_0%,_#fbd786_50%,_#f7797d_100%)] bg-[length:200%_auto] transition-all duration-500 hover:bg-[position:100%_0] shadow-md hover:shadow-lg">
                <div className="flex w-full items-center gap-4 rounded-[14px] bg-white p-4">
                  <div className="flex-shrink-0">
                    <Image
                      src="/skillImg.png"
                      width={60}
                      height={60}
                      alt="assessment icon"
                      className="object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <h2
                      className={`text-lg font-bold bg-gradient-to-r from-gray-700 to-gray-400 bg-clip-text text-transparent`}
                    >
                      Step- 3
                    </h2>
                    <h3 className="text-xl text-center font-semibold text-gray-800">
                      Quick Skill Unlock
                    </h3>
                  </div>
                </div>
              </div>
              {/* STEP - 4 ACCESS JOB PORTALS --> TELEGRAM LINK   */}
              <div className="w-full rounded-2xl p-[1.5px] bg-[linear-gradient(90deg,_#c6ffdd_0%,_#fbd786_50%,_#f7797d_100%)] bg-[length:200%_auto] transition-all duration-500 hover:bg-[position:100%_0] shadow-md hover:shadow-lg">
                <div className="flex w-full items-center gap-4 rounded-[14px] bg-white p-4">
                  <div className="flex-shrink-0">
                    <Image
                      src="/telegram.png"
                      width={48}
                      height={48}
                      alt="telegram icon"
                      className="object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <h2
                      className={`text-lg font-bold bg-gradient-to-r from-gray-700 to-blue-600 bg-clip-text text-transparent`}
                    >
                      Step- 3
                    </h2>
                    <h3 className="text-xl text-center font-semibold text-gray-800">
                      Access Job Portals Via Telegram
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Illustration  */}
          <div className="absolute -bottom-16 -right-32 z-20 hidden lg:block">
            <Image
              src="/authImg.png" // Replace with your illustration path
              alt="Security illustration"
              width={300}
              height={300}
              className="pointer-events-none"
            />
          </div>
        </div>

        {/* blob for right - UNCHANGED as requested */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.2 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute block -right-[100px] top-[60px] lg:-top-[40px] lg:-right-[240px] h-[200px] w-[200px] lg:h-[460px] lg:w-[460px] bg-gradient-to-b from-purple-400 to-pink-200 rounded-full opacity-20"
        ></motion.div>
        {/* blob for left - UNCHANGED as requested */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.2 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute block top-[260px] -left-[150px] lg:top-[240px] lg:-left-[300px] lg:h-[600px] h-[200px] w-[200px] lg:w-[600px] bg-gradient-to-b from-purple-400 to-pink-200 rounded-full opacity-20"
        ></motion.div>
      </div>

      {/* Legal Documents Section */}
      <div className="mt-10 flex flex-col items-center justify-center gap-3">
        <div className="flex items-center gap-2">
            <Image
              src="/legalImg.png" // Replace with your icon path
              width={40}
              height={40}
              alt="Document icon"
              />
            <div className="text-lg font-semibold text-black">Legal Documents:</div>
          </div>
        <div className="border-t-2 border-t-black w-full flex justify-center pt-4">
          <div className="flex flex-col gap-2 items-start">
            <p className="text-left">PAN Card</p>
            <p className="text-left">Udyam Registration Certificate</p>
            <p className="text-left">GST Certificate</p>
            <p className="text-left"> <Link className="underline" href="/privacy-policy">Privacy-Policy</Link> | <Link className="underline" href="/Terms and Conditions">Terms and Conditions</Link></p>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Page;
