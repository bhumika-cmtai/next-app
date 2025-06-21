"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox"; // Make sure you have this component
import { Mail, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookies from 'js-cookie';
import { motion } from "framer-motion";
import Image from 'next/image';
import axios from 'axios';


const Page = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); 
      setIsLoading(true);
      
      try {
        console.log()
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user/login`,{email,password})
        console.log(response)
        const data = response.data
        console.log(data)
        if (response.status !== 200) {
          console.log(data.errorMessage)
          throw new Error(data.errorMessage || "Invalid email or password");
        }

       
        const token = data.data.token;

        Cookies.set('user-token', token, {
          expires: rememberMe ? 30 : undefined, 
          sameSite: 'lax'
        });

        toast.success("Successfully logged in!");

        router.push("/dashboard");

      } catch (error: any) {
        // Show a more specific error toast
        toast.error(error.message || "An error occurred while logging in");
        console.error("Login error:", error);
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <section
      className="w-full min-h-screen relative flex items-center justify-center px-4 py-8 bg-[#F8FAFF] overflow-hidden"
      id="login"
    >
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center md:items-end justify-center gap-8 lg:gap-16 relative z-10">
        
        <div className="flex justify-center">
          <Image
            src="/loginImg.png"
            width={300}
            height={300}
            alt="Login Illustration"
            className="hidden md:block md:w-[300px] object-contain"
          />
        </div>

        <div className="w-full max-w-md bg-gradient-to-br from-[#F0FAF7]/80 to-[#EFF8FF]/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Sign In</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10"
                  value={password}
                  // --- CRITICAL FIX: Changed setEmail to setPassword ---
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                  <Checkbox
                      id="remember-me"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      disabled={isLoading}
                  />
                  <Label htmlFor="remember-me" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Remember me
                  </Label>
              </div>
            </div>

            <div className="pt-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Background blobs remain the same */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 0.2 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute block -right-[100px] top-[60px] lg:-top-[40px] lg:-right-[100px] h-[200px] w-[200px] lg:h-[300px] lg:w-[300px] bg-gradient-to-b from-purple-400 to-pink-200 rounded-full opacity-20"
      ></motion.div>
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