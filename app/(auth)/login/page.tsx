"use client";

import React, { useState, Suspense } from 'react';
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
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Cookies from 'js-cookie';
import { motion } from "framer-motion";
import Image from 'next/image';

// LoginForm component that uses useSearchParams
const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // TODO: Replace with your actual API call
      if (email === "admin@gmail.com" && password === "admin123") {
        // Set auth token cookie
        Cookies.set('auth-token', 'dummy-token', {
          expires: rememberMe ? 30 : 1, // 30 days if remember me is checked, 1 day if not
          secure: true,
          sameSite: 'lax'
        });

        // Show success message
        toast.success("Successfully logged in!");

        // Redirect to the intended page or dashboard
        router.push("/dashboard");
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      toast.error("An error occurred while logging in");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
            <div className={`rounded-xl p-[1.5px] ${isLoading ? "bg-gray-200" :"bg-gradient-to-r from-purple-300 via-cyan-400 to-green-300 "}`}>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className={`w-full px-3 py-2 bg-white rounded-[10px] border-none outline-none pl-10 ${isLoading && "bg-gray-200"}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                />
              </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
            <div className={`rounded-xl p-[1.5px] ${isLoading ? "bg-gray-200" :"bg-gradient-to-r from-purple-300 via-cyan-400 to-green-300 "}`}>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full px-3 py-2 bg-white rounded-[10px] border-none outline-none pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            disabled={isLoading}
          />
          <label
            htmlFor="remember"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Remember me
          </label>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </CardFooter>
    </form>
  );
};

const Login = () =>{
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
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Admin Login</h1>
         <LoginForm />
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
  )
}


export default Login;