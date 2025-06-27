"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { fetchLeaderCode } from "@/lib/redux/userSlice";
import { addClient } from "@/lib/redux/clientSlice";


const Page = () => {

  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>();
  const [leaderCode, setLeaderCode] = useState("")
  const [name,setName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false);

       const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!leaderCode || !name || !phoneNumber) {
      toast.error("All fields are required.");
      setIsLoading(false);
      return;
    }
    try {

      const response = await dispatch(fetchLeaderCode(leaderCode));
      
      // console.log("TL Code is valid, now adding client...");
      const clientPayload = {
        name,
        phoneNumber,
        email: email, 
        status: "New",
        leaderCode
        
      };
      
      // console.log(clientPayload)
      const result = await dispatch(addClient(clientPayload));
      // console.log(result)
      if (result) {
        toast.success("Client logged in successfully!");
        router.push("/"); 
      } 
      else {
          
          throw new Error("Failed to register the client. Please try again.");
      }

    } catch (error: any) {
      
      toast.error(error.message || "An unexpected error occurred.");
      console.error("Login process failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      className="w-full relative overflow-hidden" 
      id="get-started"
    >
      <div className="max-w-7xl w-full relative z-10 px-4 py-4 mx-auto">
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
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                      <input 
                       id="Leader Code"
                       value={leaderCode}
                       onChange={(e) => setLeaderCode(e.target.value)}
                       required
                       disabled={isLoading}
                       type="text"
                       placeholder="Team Leader Code" 
                       className="border-[1px] border-gray-400 px-3 py-2 rounded-sm"
                       />
                      <input 
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isLoading}
                        type="text"
                        placeholder="Your Name"
                        className="border-[1px] border-gray-400 px-3 py-2 rounded-sm"
                        />
                      <input 
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        type="email"
                        placeholder="Your Email"
                        className="border-[1px] border-gray-400 px-3 py-2 rounded-sm"
                        />
                      <input 
                       id="phoneNumber"
                       value={phoneNumber}
                       onChange={(e) => setPhoneNumber(e.target.value)}
                       required
                       disabled={isLoading}
                       type="text" 
                       placeholder="Your Mobile Number" 
                       className="border-[1px] border-gray-400 px-3 py-2 rounded-sm"
                      />
                      <div className="w-full mx-auto rounded-3xl p-[2px] bg-gradient-to-b from-[#A6F4C5] to-[#B6A7FF] hover:from-gold-200 hover:to-purple-500 transition-all duration-500">
                          <button className="w-full h-full text-center rounded-[22px] bg-white/90 backdrop-blur-sm px-4 py-1">
                              Submit
                          </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

          {/* blob for right -  */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 0.2 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute block -right-[100px] top-[60px] lg:-top-[40px] lg:-right-[100px] h-[200px] w-[200px] lg:h-[300px] lg:w-[300px] bg-gradient-to-b from-purple-400 to-pink-200 rounded-full opacity-20"
                  ></motion.div>w
                  {/* blob for left -  */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 0.2 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="absolute block top-[260px] -left-[150px] lg:top-[220px] lg:-left-[240px] lg:h-[600px] h-[200px] w-[200px] lg:w-[600px] bg-gradient-to-b from-purple-400 to-pink-200 rounded-full opacity-20"
                  ></motion.div>
      

    </section>
  );
};

export default Page;