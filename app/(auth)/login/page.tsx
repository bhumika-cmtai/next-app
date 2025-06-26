// login.tsx (Updated)
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
import { motion } from "framer-motion";
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/lib/store';
// --- MODIFICATION START ---
// 1. Import everything needed from the correct authSlice
import { login, selectIsLoading, selectError, setError } from '@/lib/redux/authSlice';
// --- MODIFICATION END ---

const LoginForm = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // 2. Selectors are now correctly pointing to authSlice
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

   // 3. This effect will now correctly catch and display login errors
   useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(setError(null)); // Clear error after showing
    }
  }, [error, dispatch]);

  // 4. Simplified handleSubmit to use the updated login thunk
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // The thunk now returns the user object on success or null on failure
    const user = await dispatch(login({ email, password, rememberMe }));

    if (user) {
      toast.success("Successfully logged in!");
      // The cookie is already set inside the thunk, so we just redirect
      if (user.role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/team');
      }
    }
    // If login fails, the useEffect above will handle showing the error toast.
  };

  // You can now safely remove the old handleAdminLogin and handleUserLogin methods.
  
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
  // ... (No changes needed in this part of the component)
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