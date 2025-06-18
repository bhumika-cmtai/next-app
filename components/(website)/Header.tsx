"use client"; 

import { MoveRight } from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); 

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out
        ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}
      `}
    >
      <nav className='max-w-7xl container flex items-center justify-between p-4 mx-auto'>
        <div className="hidden lg:block text-xl font-bold">LOGO</div>
        
        <ul className='flex gap-8 text-gray-800 font-semibold text-lg'>
          <Link href="#home">
            <li className='cursor-pointer hover:text-purple-600 transition-colors'>Home</li>
          </Link>
          <Link href="#about">
            <li className='cursor-pointer hover:text-purple-600 transition-colors'>About Us</li>
          </Link>
          <Link href="#join">
            <li className='cursor-pointer hover:text-purple-600 transition-colors'>Who Can Join?</li>
          </Link>
          <Link href="#contact">
            <li className='cursor-pointer hover:text-purple-600 transition-colors'>Contact Us</li>
          </Link>
        </ul>
        <div className="rounded-full bg-gradient-to-b from-sea-green-100 to-gold-200 p-1 hover:shadow-lg transition-shadow">
          <Link
            href="#"
            className="flex h-full w-full items-center justify-center gap-[6px] back bg-sea-green-100 rounded-full  px-4 py-2 font-semibold text-gray-800 transition-colors"
          >
            Sign up
            <MoveRight size={16} strokeWidth={2.5} />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;