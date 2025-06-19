import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer: React.FC = () => {
  const servicesLinks = [
    "Work From Anywhere",
    "Pending KYC Approval Tasks",
    "New Account Opening Work",
    "Data Management & Entry",
    "Customer Support Services",
  ];

  const usefulLinks = [
    { name: "Home", href: "#" },
    { name: "About Us", href: "#aboutus" },
    { name: "What We Do", href: "#whatwedo" },
    { name: "Who Can Join", href: "#join" },
    { name: "Why Choose Us?", href: "#whychooseus" },
  ];
  
  const supportLinks = [
      { name: "Contact", href: "/contact" },
  ];

  return (
    <footer className="w-full bg-gradient-to-br from-pink-100/10 to-sea-green-100/40 text-gray-800">
      <div className="container mx-auto px-6 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          <div className="lg:col-span-2">
            <div className="inline-block p-1 rounded-full bg-gradient-to-r from-yellow-400 to-green-300">
              <Link
                href="#"
                className="flex h-full w-full items-center justify-center gap-[6px] back bg-green-200 rounded-full  px-8 py-3 text-lg font-semibold text-gray-800 transition-colors"
               >
                GROW UP
              </Link>
            </div>
            <p className="mt-6 text-gray-600 leading-relaxed max-w-sm">
              At GrowUp, your growth is our mission. Join our team today and start earning while learning—right from your home!
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://www.instagram.com/growup_india_?igsh=MTIxeDZ5aDRqbjI5aA==" aria-label="Instagram" className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform hover:scale-110">
                <Image
                  alt="Instagram icon"
                  src="/instagram.png"
                  width={30}
                  height={30}
                /> 
              </a>
              <a href="https://youtube.com/@growup_india_01?feature=shared" aria-label="Youtube" className="w-10 h-10 rounded-lg flex items-center justify-center  transition-transform hover:scale-110">
                <Image
                  alt="youtube icon"
                  src="/youtube.png"
                  width={30}
                  height={30}
                />
              </a>
              <a href="https://x.com/GrowUp_india_?t=ynPhvGl3FYJDB-2QJmzxiQ&s=09" aria-label="Twitter" className="w-10 h-10 rounded-lg flex items-center justify-center  transition-transform hover:scale-110">
                <Image
                  alt="twitter icon"
                  src="/twitter.png"
                  width={30}
                  height={30}
                />
              </a>
              <a href="https://www.linkedin.com/in/grow-up-a25b69294?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app " aria-label="Twitter" className="w-10 h-10 rounded-lg flex items-center justify-center  transition-transform hover:scale-110">
                <Image
                  alt="linkedin icon"
                  src="/linkedin.png"
                  width={30}
                  height={30}
                />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Our Services</h3>
            <ul className="space-y-2">
              {servicesLinks.map((link, index) => (
                <li key={index}>
                  <Link href="#" className="text-gray-600 text-base text-nowrap mb-2 hover:text-black transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Useful Links</h3>
            <ul className="space-y-2">
              {usefulLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-600 text-base hover:text-black transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Support</h3>
             <ul className="space-y-3 mb-8">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-600 hover:text-black transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            <h3 className="text-lg font-bold mb-4">Newsletter</h3>
            <div className="relative p-[2px] rounded-full bg-gradient-to-r from-green-300 to-yellow-400">
               <input 
                 type="email" 
                 placeholder="Your email*"
                 className="w-full bg-green-100/80 rounded-full py-3 px-6 text-sm text-gray-700 placeholder-gray-500 border-none focus:ring-2 focus:ring-green-400 focus:outline-none"
               />
            </div>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-gray-500 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <p className="mb-4 sm:mb-0 font-medium text-gray-700">
            © 2025 Grow up || All Rights Reserved
          </p>
          <Link href="/terms" className="hover:text-black transition-colors font-medium text-gray-700">
            Terms & Conditions
          </Link>
        </div>

      </div>
    </footer>
  );
};

export default Footer;