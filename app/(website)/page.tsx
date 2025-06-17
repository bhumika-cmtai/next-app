import Link from 'next/link';
import Hero from './home/Hero'
import WhatWeDo from './home/WhatWeDo';


export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Hero />
      <WhatWeDo />
    </main>
  );
}