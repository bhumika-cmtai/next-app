"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link"; // Although not used, kept for potential future use
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react"; // Import a loader for the button

const Page = () => {
  const router = useRouter();
  const [leaderCode, setLeaderCode] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!leaderCode || !name || !phoneNumber) {
      toast.error("Leader Code, Name, and Phone Number are required.");
      setIsLoading(false);
      return;
    }

    // --- Static Data Simulation ---
    const VALID_LEADER_CODE = "1234"; // Hardcoded valid code for testing

    // Simulate network delay
    setTimeout(() => {
      // 1. Simulate fetching and validating the leader code
      if (leaderCode !== VALID_LEADER_CODE) {
        toast.error("Invalid Leader Code. Please try again.");
        setIsLoading(false);
        return; // Stop the process if the code is invalid
      }

      // 2. If code is valid, simulate adding the client
      console.log("Leader Code is valid, now simulating client registration...");
      const clientPayload = {
        name,
        phoneNumber,
        email: email,
        status: "New",
        leaderCode,
      };

      console.log("Simulated Client Payload:", clientPayload);

      // Simulate success
      toast.success("Client registered successfully!");
      router.push("/"); // Redirect on success
      
      // We don't need to set isLoading to false here because of the redirect
      // but it's good practice in case the redirect is removed later.
      setIsLoading(false);
      
    }, 1500); // 1.5-second delay to mimic a real API call
  };

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
              <h1 className="font-bold text-2xl bg-gradient-to-r from-black via-purple-400 to-pink-200 via-60% bg-clip-text text-transparent">
                Registration Form:
              </h1>
              <div className="w-full rounded-2xl p-[1.5px] bg-[linear-gradient(90deg,_#c6ffdd_0%,_#fbd786_50%,_#f7797d_100%)] bg-[length:200%_auto] transition-all duration-500 hover:bg-[position:100%_0] shadow-md hover:shadow-lg">
                <div className="flex flex-col w-full items-center gap-4 rounded-[14px] bg-white py-10">
                  <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <input
                      id="leaderCode"
                      value={leaderCode}
                      onChange={(e) => setLeaderCode(e.target.value)}
                      required
                      disabled={isLoading}
                      type="text"
                      placeholder="4 Digit TL Code (e.g., 1234)"
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
                      // Email is not required in the validation logic, so removing `required`
                      disabled={isLoading}
                      type="email"
                      placeholder="Your Email (Optional)"
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
                      <button
                        type="submit" // Explicitly set button type
                        disabled={isLoading}
                        className="w-full h-full text-center rounded-[22px] bg-white/90 backdrop-blur-sm px-4 py-2 flex items-center justify-center"
                      >
                        {isLoading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          "Submit"
                        )}
                      </button>
                    </div>
                  </form>
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
        ></motion.div>
        {/* blob for left -  */}
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