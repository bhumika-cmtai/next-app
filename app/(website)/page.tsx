import Link from 'next/link';
import Hero from './home/Hero'
import WhatWeDo from './home/WhatWeDo';
import { Noto_Sans } from 'next/font/google';
import AboutUs from './home/AboutUs';
import WhyChooseUs from './home/WhyChooseUs';
import WhoCanJoin from './home/WhoCanJoin';
import LegalStatus from './home/LegalStatus';
import Achievements from './home/Achievements';

export default function HomePage() {
  return (
    <main className="flex min-h-screen max-w-7xl flex-col items-center justify-center py-24 px-10 ">
      <Hero />
      <WhatWeDo />
      <AboutUs />
      <WhyChooseUs />
      <WhoCanJoin />
      <LegalStatus />
      <Achievements />
    </main>
  );
}