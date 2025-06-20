"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";


const Page = () => {
  return (
    <section
      className="max-w-7xl w-full relative z-10 px-4 py-4 mx-auto overflow-hidden"
      id="get-started"
    >
      <div className="w-full flex justify-center min-h-screen ">
        <div className="relative w-full max-w-3xl flex flex-col items-center py-6">
            <Image 
              src="/freelancersIcon.png"
              width={200}
              height={200}
              alt="Auth Image"
              className="mb-4"
            />
          <div className="w-full max-w-lg mx-auto rounded-3xl p-[2px] bg-gradient-to-b from-[#A6F4C5] to-[#B6A7FF]">
            <div className="w-full h-full flex flex-col items-center gap-6 rounded-[22px] bg-white/90 backdrop-blur-sm p-8 ">
              {/* REGISTER FORM*/}
              <h1 className="font-bold text-2xl bg-gradient-to-r from-black via-purple-400 to-pink-200 via-60% bg-clip-text text-transparent">Registeration Form: </h1>
              <div className="w-full rounded-2xl p-[1.5px] bg-[linear-gradient(90deg,_#c6ffdd_0%,_#fbd786_50%,_#f7797d_100%)] bg-[length:200%_auto] transition-all duration-500 hover:bg-[position:100%_0] shadow-md hover:shadow-lg">
                <div className="flex flex-col w-full items-center gap-4 rounded-[14px] bg-white py-10">
                  <div className="flex flex-col gap-4">
                    <input type="text" placeholder="4 Digit TL Code" className="border-[1px] border-gray-400 px-3 py-2 rounded-sm"/>
                    <input type="text" placeholder="Your Name" className="border-[1px] border-gray-400 px-3 py-2 rounded-sm"/>
                    <input type="text" placeholder="Your Mobile Number" className="border-[1px] border-gray-400 px-3 py-2 rounded-sm"/>
                    <div className="w-[100px] mx-auto rounded-3xl p-[2px] bg-gradient-to-b from-[#A6F4C5] to-[#B6A7FF] hover:from-gold-200 hover:to-purple-500 transition-all duration-500">
                        <button className="w-full h-full text-center rounded-[22px] bg-white/90 backdrop-blur-sm px-4 py-1">
                            Submit
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

    </section>
  );
};

export default Page;
