"use client"
import { useInView } from "framer-motion"
import {motion} from "framer-motion"
import { useRef } from "react"
import Image from "next/image"

export default function AboutUs() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="py-16 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: [0, -360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute bottom-40 right-10 text-purple-200 text-3xl"
        >
          +
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16" 
        >
          <h2 className="text-4xl md:text-5xl md:text-5xl font-bold mb-4">
            <span className='bg-gradient-to-r from-black to-purple-400 bg-clip-text text-transparent'>ABOUT</span> <span className='bg-gradient-to-r from-purple-400 to-[#ffc6d2] bg-clip-text text-transparent'>US</span>
          </h2>
        </motion.div>

        
        <div className="max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-y-12 lg:gap-x-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <Image
              src="/aboutus.png"
              alt="About Us Team Illustration"
              width={600}
              height={500}
              className="w-full h-auto rounded-3xl"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center lg:text-left"
          >
            <p className="text-black  leading-relaxed text-base md:text-lg font-medium">
              They Were Inspired By Mr. Gaurav Prajapati And Mr. Priya Darling, Who Brought This Vision Into Action For
              The Platform... In Which They Are Providing Work From Home Opportunities For All And A Rich Budget Into
              Digital Requirements And Job Roles That They Can Do From Home For An Extra Income To Support Their Family.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}