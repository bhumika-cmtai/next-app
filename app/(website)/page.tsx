import Hero from './home/Hero'
import WhatWeDo from './home/WhatWeDo';
import AboutUs from './home/AboutUs';
import WhyChooseUs from './home/WhyChooseUs';
import WhoCanJoin from './home/WhoCanJoin';
import LegalStatus from './home/LegalStatus';
import Achievements from './home/Achievements';
import Testimonials from './home/Testimonials';

export default function HomePage() {
  return (
    <main className="flex min-h-screen max-w-7xl flex-col items-center justify-center py-24 ">
      <Hero />
      <WhatWeDo />
      <AboutUs />
      <WhyChooseUs />
      <WhoCanJoin />
      <Testimonials />
      <LegalStatus />
      <Achievements />
    </main>
  );
}