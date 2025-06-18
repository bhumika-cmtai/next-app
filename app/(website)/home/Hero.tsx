import Image from 'next/image';
import React from 'react';

const Hero = () => {
  return (
    <section className="max-w-7xl w-full relative z-10 text-center px-4 " id="home">
      <div>
        <div className="flex flex-col">
            <div className=' lg:grid lg:grid-cols-6 justify-between'>
                <div className='lg:col-span-4 flex gap-2 flex-col mx-auto'>     
                    <h1 className="text-6xl md:text-8xl mb-4 font-bold font-sans-noto tracking-wide bg-gradient-to-r from-purple-400 to-pink-200 bg-clip-text text-transparent drop-shadow-md drop-shadow-gray-700 ">
                        GROW UP
                    </h1>

                    <div className="w-full text-sm md:text-base font-semibold text-gray-subtitle ">
                        <p>Work From Home With Zero Investment</p>
                        <p>Empowering Individuals. Creating Opportunities.</p>
                    </div>
                </div>

                <div className=' lg:col-span-1 w-[320px] h-auto  overflow-hidden rounded-xl'>
                     
                    <Image 
                      src="/liveVideo2-unscreen.gif"
                      alt='livevideo'
                      width={500}
                      height={300}

                    />
                </div>

            </div>
            <div className='w-full'>
                <p className="w-full mt-3 leading-[25px] lg:leading-[40px]  md:text-lg font-semibold max-w-3xl mx-auto  text-gray-800">
                    At GROWUP Our Mission Is To Empower Individuals In India By Providing Real Work-from-home Opportunities With No Investment. Whether You Are A Student, Homemaker, Retired Professional, Or Someone Who Wants To Make Extra Money, We Offer Sure-shot And Easy-to-do Work That Enables You To Create A Better Future — From The Comfort Of Your Own Home.
                </p>
            </div>
            {/* blob for right */}
            <div className='absolute block -right-[100px] top-[60px] lg:-top-[40px] lg:-right-[240px] h-[200px] w-[200px] lg:h-[460px] lg:w-[460px] bg-gradient-to-b from-purple-400 to-pink-200 rounded-full opacity-20'>
            </div>
            {/* blob for left  */}
            <div className='absolute block  top-[260px] -left-[150px] lg:top-[240px] lg:-left-[360px] lg:h-[600px] h-[200px] w-[200px] lg:w-[600px] bg-gradient-to-b from-purple-400 to-pink-200 rounded-full opacity-20'>
            </div>
        </div>
        <div></div>
      </div>
    </section>
  );
};

export default Hero;