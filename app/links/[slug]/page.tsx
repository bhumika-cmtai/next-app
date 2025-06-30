// app/links/[slug]/page.tsx

"use client";
import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";

// Import the specific thunks you need
import { fetchLeaderCode } from "@/lib/redux/userSlice";
import { addClient } from "@/lib/redux/clientSlice";
import { fetchLinkBySlug } from "@/lib/redux/linkSlice";
import { Loader2 } from "lucide-react";

const Page = ({ params }:{ params: Promise<{ slug: string }> }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { slug } = use(params);
  const [leaderCode, setLeaderCode] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [portalUrl, setPortalUrl] = useState<string | null>(null);
  
  const isFetchingLink = useSelector((state: RootState) => state.links.isLoading);

  const formattedTitle = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  useEffect(() => {
    const loadLink = async () => {
      if (slug) {
        const linkData = await dispatch(fetchLinkBySlug(slug));
        if (linkData && linkData.link) {
          setPortalUrl(linkData.link);
        } else {
          toast.error(`Could not find a portal for "${formattedTitle}".`);
            setTimeout(() => {
            router.push('/');
            }, 3000); 
        }
      }
    };
    loadLink();
  }, [dispatch,slug, router, formattedTitle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!portalUrl) {
      toast.error("Portal link is not available. Cannot submit.");
      setIsSubmitting(false);
      return;
    }

    if (!leaderCode || !name || !phoneNumber) {
      toast.error("All fields are required.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Step 1: Validate the leader code
      await dispatch(fetchLeaderCode(leaderCode));
      console.log("leadercode fetch")
      
      // Step 2: If leader code is valid, add the client
      const clientPayload = { name, phoneNumber, leaderCode, status: "New", portalName: slug };
      const result = await dispatch(addClient(clientPayload));
      
      
      // Step 3: If client is added successfully, redirect to the portal link
      if (result) {
        toast.success("Details saved! Redirecting to portal...");
        setTimeout(() => {
          router.push(portalUrl);
        }, 5000);
      } else {
        throw new Error("Failed to register client. Please try again.");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show a loading spinner while the initial link is being fetched
  if (isFetchingLink && !portalUrl) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600 mb-4" />
        <p className="text-lg font-semibold text-gray-700">Loading {formattedTitle} Portal...</p>
      </div>
    );
  }

  return (
    <section className="w-full relative overflow-hidden" id="registration">
      <div className="max-w-7xl w-full relative z-10 px-4 py-4 mx-auto">
        <div className="w-full flex justify-center min-h-screen items-center">
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
                  {formattedTitle} Portal
                </h1>
                <div className="w-full rounded-2xl p-[1.5px] bg-[linear-gradient(90deg,_#c6ffdd_0%,_#fbd786_50%,_#f7797d_100%)] bg-[length:200%_auto] transition-all duration-500 hover:bg-[position:100%_0] shadow-md hover:shadow-lg">
                  <div className="flex flex-col w-full items-center gap-4 rounded-[14px] bg-white py-10 px-6">
                    <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
                      <input
                        id="Leader Code"
                        value={leaderCode}
                        onChange={(e) => setLeaderCode(e.target.value)}
                        required
                        disabled={isSubmitting}
                        type="text"
                        placeholder="Team Leader Code"
                        className="border-[1px] border-gray-400 px-3 py-2 rounded-md"
                      />
                      <input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isSubmitting}
                        type="text"
                        placeholder="Your Name"
                        className="border-[1px] border-gray-400 px-3 py-2 rounded-md"
                      />
                      <input
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        disabled={isSubmitting}
                        type="text"
                        placeholder="Your Mobile Number"
                        className="border-[1px] border-gray-400 px-3 py-2 rounded-md"
                      />
                      <div className="w-full mx-auto rounded-3xl p-[2px] bg-gradient-to-b from-[#A6F4C5] to-[#B6A7FF] hover:from-gold-200 hover:to-purple-500 transition-all duration-500">
                        <button className="w-full h-full text-center rounded-[22px] bg-white/90 backdrop-blur-sm px-4 py-2 font-semibold disabled:opacity-50" disabled={isSubmitting}>
                          {isSubmitting ? "Submitting..." : "Submit"}
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
      {/* Blob animations */}
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
        className="absolute block top-[260px] -left-[150px] lg:top-[220px] lg:-left-[240px] lg:h-[600px] h-[200px] w-[200px] lg:w-[600px] bg-gradient-to-b from-purple-400 to-pink-200 rounded-full opacity-20"
      ></motion.div>
    </section>
  );
};

export default Page;