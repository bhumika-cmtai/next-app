"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const Page = () => {
  return (
    <section
      className="w-full min-h-screen relative flex items-center justify-center px-4 py-8 bg-[#F8FAFF] overflow-hidden"
      id="login"
    >
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center md:items-end justify-center gap-8 lg:gap-16 relative z-10">
        
        {/* Left Side: Illustration */}
        <div className="flex justify-center">
          <Image
            src="/loginImg.png"
            width={300}
            height={300}
            alt="Login Illustration"
            className="hidden md:block md:w-[300px] object-contain"
          />
        </div>

        {/* Right Side: Form */}
        <div className="w-full max-w-md bg-gradient-to-br from-[#F0FAF7]/80 to-[#EFF8FF]/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">sign in</h1>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email Address
              </label>
              <div className="rounded-xl p-[1.5px] bg-gradient-to-r from-purple-300 via-cyan-400 to-green-300">
                <input
                  type="email"
                  className="w-full px-3 py-2 bg-white rounded-[10px] border-none outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <div className="rounded-xl p-[1.5px] bg-gradient-to-r from-purple-300 via-cyan-400 to-green-300">
                <input
                  type="password"
                  className="w-full px-3 py-2 bg-white rounded-[10px] border-none outline-none"
                />
              </div>
              <div className="text-right mt-2">
                <a
                  href="#"
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div className="pt-2">
              <div className="rounded-xl p-[1.5px] bg-gradient-to-r from-purple-300 via-cyan-400 to-green-300">
                <button
                  type="submit"
                  className="w-full px-3 py-2 bg-white text-gray-700 font-semibold rounded-[10px]"
                >
                  Sign in
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* blob for right -  */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 0.2 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute block -right-[100px] top-[60px] lg:-top-[40px] lg:-right-[100px] h-[200px] w-[200px] lg:h-[300px] lg:w-[300px] bg-gradient-to-b from-purple-400 to-pink-200 rounded-full opacity-20"
      ></motion.div>
      {/* blob for left -  */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 0.2 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="absolute block top-[260px] -left-[150px] lg:top-[240px] lg:-left-[300px] lg:h-[600px] h-[200px] w-[200px] lg:w-[600px] bg-gradient-to-b from-purple-400 to-pink-200 rounded-full opacity-20"
      ></motion.div>
    </section>
  );
};

export default Page;