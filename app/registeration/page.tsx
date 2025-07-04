"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { createRegisteration } from "@/lib/redux/registerationSlice";
import { fetchLeaderCode } from "@/lib/redux/userSlice"; // Import the thunk to verify the leader code
import { Loader2 } from "lucide-react";
import { verifyCredentialsAndGetLink } from "@/lib/redux/joinlinkSlice";
import Link from "next/link";
import { Dialog, DialogContent, DialogTitle,DialogHeader } from "@/components/ui/dialog";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}


const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [leaderCode, setLeaderCode] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [validatedLeaderName, setValidatedLeaderName] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  // NEW: State for the image modal
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState("");
    const [modalImageTitle, setModalImageTitle] = useState("");
  const [isFetchingZoom, setIsFetchingZoom] = useState(false);
    

  // Debounce the leaderCode input
  const debouncedLeaderCode = useDebounce(leaderCode, 500);

   useEffect(() => {
    if (!debouncedLeaderCode) {
      setValidatedLeaderName(null);
      setCodeError(null);
      return;
    }

    const verifyCode = async () => {
      setIsCheckingCode(true);
      setValidatedLeaderName(null);
      setCodeError(null);
      
      try {
        // Since the thunk returns data on success, we can await it.
        const leaderData = await dispatch(fetchLeaderCode(debouncedLeaderCode));
        // The thunk throws on error, so if we get here, it's a success.
        setValidatedLeaderName(leaderData.name);
      } catch (error: any) {
        // The thunk throws on failure, so we catch the error here.
        setCodeError(error.message || "Invalid Leader Code.");
      } finally {
        setIsCheckingCode(false);
      }
    };

    verifyCode();
  }, [debouncedLeaderCode, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!leaderCode || !name || !phoneNumber) {
      toast.error("Leader Code, Name, and Phone Number are required.");
      setIsLoading(false);
      return;
    }

    try {
      // Step 1: Verify the Leader Code exists by dispatching fetchLeaderCode.
      // We'll use RTK's built-in matchers to check if the thunk was fulfilled or rejected.
      const leaderInfo = await dispatch(fetchLeaderCode(leaderCode));
      if(!leaderInfo){
        toast.error("leader code is not valid")
      }
      // If we reach here, the leader code is valid.

      // Step 2: Proceed to create the registration.
      const registerationPayload = {
        name,
        phoneNumber,
        email: email || undefined, // Pass undefined if email is empty
        leaderCode,
      };

      const registerationResult = await dispatch(
        createRegisteration(registerationPayload)
      );

      if (registerationResult ) {
        toast.success(
          "Registration successful! Redirecting to join the group...!"
        );
        const WHATSAPP_GROUP_APP_NAME = 'whatsapp';
        const whatsappLink = await dispatch(verifyCredentialsAndGetLink({ appName: WHATSAPP_GROUP_APP_NAME }));

        if (whatsappLink) {
          // If the link is found, redirect the user to it.
          // Using window.location.href is best for external URLs.
          window.location.href = whatsappLink;
        } else {
          // If the link is not found, the thunk will show an error toast.
          // We can show an info message and redirect to a fallback page.
          toast.info("Could not retrieve the group link. Redirecting to homepage.");
          router.push("/");
        }
        router.push("/"); // Redirect on success
      } else {
        // Handle failure, e.g., duplicate phone number
        toast.error(
          
            "Registration failed. This phone number or email may already be registered."
        );
      }
    } catch (error: any) {
      // This will catch any unexpected errors during the process
      toast.error("number exist")
      // toast.error("An unexpected error occurred. Please try again later.");
      console.error("Registration process failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleZoomClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault(); // Prevent any default button behavior
      setIsFetchingZoom(true);
  
      // This appName MUST match an entry in your database's joinlinks collection
      const ZOOM_APP_NAME = 'zoom';
  
      try {
        const link = await dispatch(verifyCredentialsAndGetLink({ appName: ZOOM_APP_NAME }));
  
        if (link) {
          // Redirect to the fetched link if successful
          window.location.href = link;
        }
        // If the link is null, the thunk already shows an error toast, so we don't need to do anything here.
      } catch (error) {
        console.error("Failed to fetch Zoom link:", error);
        // The thunk should handle the toast, but this is a fallback.
      } finally {
        // Ensure the loading state is turned off, even if redirection fails
        setIsFetchingZoom(false);
      }
    };

  const handleDocumentClick = (imageUrl: string, title: string) => {
    setModalImageUrl(imageUrl);
    setModalImageTitle(title);
    setIsImageModalOpen(true);
  };


  return (
    <>
    <section className="w-full relative overflow-hidden" id="registeration">
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
                <h1 className="font-bold text-2xl bg-gradient-to-r from-black via-purple-400 to-pink-200 via-60% bg-clip-text text-transparent">
                  Registration Form:{" "}
                </h1>
                <div className="w-full rounded-2xl p-[1.5px] bg-[linear-gradient(90deg,_#c6ffdd_0%,_#fbd786_50%,_#f7797d_100%)] bg-[length:200%_auto] transition-all duration-500 hover:bg-[position:100%_0] shadow-md hover:shadow-lg">
                  <div className="flex flex-col w-full items-center gap-4 rounded-[14px] bg-white py-10">
                    <form
                      className="flex flex-col gap-4"
                      onSubmit={handleSubmit}
                    >
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
                        disabled={isLoading}
                        type="email"
                        placeholder="Your Email "
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
                          type="submit"
                          disabled={isLoading}
                          className="w-full h-full text-center rounded-[22px] bg-white/90 backdrop-blur-sm px-4 py-1 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? "Submitting..." : "Submit"}
                        </button>
                      </div>
                    </form>
                    <div className="mt-2 text-sm text-center h-5">
                      {isCheckingCode && (
                        <span className="flex items-center text-gray-500">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying code...
                        </span>
                      )}
                      {validatedLeaderName && !isCheckingCode && (
                        <p className="text-green-600 font-medium">
                          Leader: {validatedLeaderName}
                        </p>
                      )}
                      {codeError && !isCheckingCode && (
                        <p className="text-red-600">{codeError}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Motion divs for background blobs */}
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
      <div className="mt-5 mb-10 w-full flex flex-col items-center justify-center gap-3">
        <div className="flex items-center gap-2">
            <Image
              src="/legalImg.png" 
              width={40}
              height={40}
              alt="Document icon"
              />
            <div className="text-lg font-semibold text-black">Legal Documents:</div>
           
        </div>
        <div className="w-full border-t-[1px] border-t-black flex justify-center pt-4">
            
          <div className="flex flex-col gap-2 items-start px-4">
           <button onClick={() => handleDocumentClick('/pan_card.jpg', 'PAN Card')} className="text-left underline cursor-pointer hover:text-blue-600 transition-colors">PAN Card</button>
              <button onClick={() => handleDocumentClick('/udyam_Registration Certificate.jpg', 'Udyam Registration Certificate')} className="text-left underline cursor-pointer hover:text-blue-600 transition-colors">Udyam Registration Certificate</button>
              <button onClick={() => handleDocumentClick('/gst_certificate.jpg', 'GST Certificate')} className="text-left underline cursor-pointer hover:text-blue-600 transition-colors">GST Certificate</button>
            <p className="text-left"> <Link className="underline" href="/privacy-policy">Privacy-Policy</Link> | <Link className="underline" href="/terms-and-conditions">Terms and Conditions</Link> | 
            <Link href="https://www.instagram.com/indiagrowup__?igsh=Ymttb3FoZGh1Zm1u" className="inline-flex items-center gap-1.5 underline ">Follow Us On Insta <Image src="/instagram.png" alt="instagram" width={16} height={16} className="w-4"/></Link></p>
          </div>
        </div>
      </div>
      {/* NEW: Dialog component for displaying the image */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{modalImageTitle}</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-[70vh] mt-4">
            <Image
              src={modalImageUrl}
              alt={modalImageTitle}
              fill
              className="object-contain"
              priority={true} // Prioritize loading the image in the modal
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            />
          </div>
        </DialogContent>
      </Dialog>
    </section>
    </>
  );
};

export default Page;