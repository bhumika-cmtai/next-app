"use client";

import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // --- FIX FOR HYDRATION ERROR ---
  // We need to ensure the server and initial client render match.w
  // This state will be false on the server and true on the client after mounting.
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);
  // --------------------------------

  useEffect(() => {
    // Only add the scroll listener if the component has mounted on the client
    if (!hasMounted) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    
    window.addEventListener('scroll', handleScroll);
    // Also call it once to set initial state
    handleScroll(); 
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasMounted]); // Depend on hasMounted

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  // --- CORRECTION 1: Use valid anchor hrefs for on-page scrolling ---
  const navLinks = [
    { href: "/#home", label: "Home" },
    { href: "/#aboutus", label: "About Us" },
    { href: "/#join", label: "Who Can Join" },
    { href: "/#contactus", label: "Contact Us" },
  ];

  // Determine header background, but only after client has mounted
  const headerBg = hasMounted && (isScrolled || isMenuOpen) ? 'bg-white shadow-md' : 'bg-transparent';

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out
        ${headerBg}
      `}
    >
      <nav className='max-w-7xl container flex items-center justify-between p-1 mx-auto px-4'>
        <Link href="#home" aria-label="Go to homepage">
          <Image
            src="/growupIcon.png"
            width={100}
            height={100}
            alt='grow up logo'
            className='w-[60px] md:w-[80px] h-auto'
          />
        </Link>
        
        {/* --- CORRECTION 2: Use <Link> for desktop navigation, not <button> --- */}
        <ul className='hidden lg:flex gap-8 text-gray-800 font-semibold text-lg'>
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-800"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      <div
        className={`
          lg:hidden absolute top-full left-0 w-full bg-white overflow-hidden transition-all duration-500 ease-in-out
          ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        {/* --- CORRECTION 3: Fix invalid HTML (<li> must wrap <a>) --- */}
        <ul className='flex flex-col items-center gap-6 p-8 text-lg'>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className='cursor-pointer hover:text-purple-600 transition-colors'
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Header;