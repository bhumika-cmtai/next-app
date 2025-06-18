"use client"
import React, { useRef } from 'react';
import { motion, useInView } from "framer-motion";
import Image from 'next/image';

const governmentLogos = [
  { src: '/adharIcon.png', alt: 'adhar', height: 110 },
  { src: '/digitalIndiaIcon.png', alt: 'digital india', height: 60 },
  { src: '/msmeIcon.png', alt: 'MSME', height: 90 },
  { src: '/govtOfIndiaIcon.png', alt: 'govt Of India Icon', height: 90 },
];

const bankLogos = [
  { src: '/axisBankIcon.png', alt: 'axis bank', height: 45 },
  { src: '/bankOfBarodaIcon.png', alt: 'Bank of Baroda', height: 45 },
  { src: '/canaraBankIcon.png', alt: 'Canara Bank Icon', height: 45 },
  { src: '/hdfcIcon.png', alt: 'hdfc bank Icon', height: 45 },
  { src: '/iciciBankIcon.png', alt: 'icici bank Icon', height: 45 },
  { src: '/yesBankIcon.png', alt: 'Yes Bank', height: 45 },
  { src: '/upstoxIcon.png', alt: 'Upstox', height: 45 },
];

const scrollAnimation = (direction: 'left' | 'right') => ({
  animate: {
    x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
  },
  transition: {
    repeat: Infinity,
    duration: 20,
    ease: 'linear',
  },
});

const LegalStatus: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4">

          <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-16"
                >
                <h2 className="text-6xl font-bold mb-4 bg-gradient-to-r from-black via-purple-400 via-50% to-75% to-pink-100 bg-clip-text text-transparent">
                      OUR LEGAL STATUS
                </h2>
            </motion.div>
          <p className='text-center font-semibold text-base text-gray-700 max-w-4xl mx-auto'>
            We are a Government Registered Platform, operating with complete legal transparency. Your trust and security are our top
            priorities. All our services and processes comply with official norms and digital safety standards.
          </p>

        <div className="relative mt-16 flex flex-col space-y-12">

          <div className="relative w-full overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

            <motion.div className="flex w-max" {...scrollAnimation('right')}>
              {[...governmentLogos, ...governmentLogos].map((logo, index) => (
                <div key={`gov-${index}`} className="flex-shrink-0 w-64 h-32 flex items-center justify-center px-4">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={150}
                    height={logo.height}
                    className="object-contain"
                  />
                </div>
              ))}
            </motion.div>
          </div>

          <div className="relative w-full overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l  to-transparent z-10 pointer-events-none" />

            <motion.div className="flex w-max" {...scrollAnimation('left')}>
              {[...bankLogos, ...bankLogos].map((logo, index) => (
                <div key={`bank-${index}`} className="flex-shrink-0 w-64 h-20 flex items-center justify-center px-4">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={150}
                    height={logo.height}
                    className="object-contain"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegalStatus;
