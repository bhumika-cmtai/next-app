"use client";

import React, { useState, Suspense, useEffect } from 'react';
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookies from 'js-cookie';
import { motion } from "framer-motion";
import Image from 'next/image';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/lib/store';
import { login, selectIsLoading } from '@/lib/redux/authSlice';
import { selectError, setError } from '@/lib/redux/userSlice';

const LoginForm = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

   useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(setError(null));
    }
  }, [error, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("handle submit log")
    const result = await dispatch(login({ email, password }));

    if (result && result.user && result.token) {
      Cookies.set('auth-token', result.token, {
        expires: rememberMe ? 30 : 1, 
        sameSite: 'lax'
      });

      toast.success("Successfully logged in!");

      console.log(result.user)
      if (result.user.role === 'admin') {
        router.push('/dashboard/admin/users');
      } else {
        router.push('/dashboard/user');
      }
    }
  };



  const handleAdminLogin = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (password === "admin123") {
        Cookies.set('auth-token', 'dummy-admin-token', {
          expires: rememberMe ? 30 : 1, 
          secure: process.env.NODE_ENV !== 'development',
          sameSite: 'lax'
        });

        toast.success("Admin successfully logged in!");
        router.push("/dashboard");
      } else {
        toast.error("Invalid admin password");
      }
    } catch (error) {
      toast.error("An error occurred during admin login");
      console.error("Admin Login error:", error);
    }
  };

  const handleUserLogin = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user/login`, { email, password });
      
      const data = response.data;
      const token = data.data.token;

      Cookies.set('user-token', token, {
        expires: rememberMe ? 30 : undefined, 
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'lax'
      });

      toast.success("Successfully logged in!");
      router.push("/team"); 

    } catch (error: any) {
      const errorMessage = error.response?.data?.errorMessage || error.message || "An error occurred while logging in";
      toast.error(errorMessage);
      console.error("User Login error:", error);
    }
  };
  
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   if (email.toLowerCase() === "admin@gmail.com") {
  //     await handleAdminLogin();
  //   } else {
  //     await handleUserLogin();
  //   }
    
  //   setIsLoading(false);
  // };

  return (
    <Card className="w-full max-w-sm bg-gradient-to-br from-[#F0FAF7]/80 to-[#EFF8FF]/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border-none">
      <CardHeader className="text-center p-0 mb-6">
        <CardTitle className="text-4xl font-bold text-gray-900">
          Sign In
        </CardTitle>
        <CardDescription>
          Enter your credentials to access your account.
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 p-0">
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
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 pt-2">
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
        <CardFooter className="p-0 pt-6">
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
    </Card>
  );
};

const LoginPage = () => {
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
        <Suspense fallback={<div className="w-full max-w-md h-[650px] bg-white/50 rounded-3xl animate-pulse"></div>}>
          <LoginForm />
        </Suspense>

      </div>

      {/* Background Blobs */}
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
  )
}

export default LoginPage;