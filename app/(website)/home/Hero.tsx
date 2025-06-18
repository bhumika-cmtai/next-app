import CircularBlob from '@/components/ui/circularBlob';
import React from 'react';

const Hero = () => {
  return (
    <section className="max-w-7xl relative z-10 text-center px-4 " id="home">
      <div>
        <div className="flex flex-col ">
            <div className='grid grid-cols-6 justify-between'>
                <div className='col-span-4 flex gap-2 flex-col mx-auto'>     
                    <h1 className="text-6xl  md:text-8xl font-bold font-sans-noto tracking-wide bg-gradient-to-r from-purple-400 to-pink-200 bg-clip-text text-transparent drop-shadow-md drop-shadow-gray-700 ">
                        GROW UP
                    </h1>

                    <div className=" font-semibold text-gray-subtitle ">
                        <p>Work From Home With Zero Investment</p>
                        <p>Empowering Individuals. Creating Opportunities.</p>
                    </div>
                </div>
                <div className=' col-span-1 h-[200px] w-[200px]'>
                    some image
                </div>
            </div>
            <div className=''>
                <p className="mt-3 leading-[40px] text-lg font-semibold max-w-3xl mx-auto  text-gray-800">
                    At GROWUP Our Mission Is To Empower Individuals In India By Providing Real Work-from-home Opportunities With No Investment. Whether You Are A Student, Homemaker, Retired Professional, Or Someone Who Wants To Make Extra Money, We Offer Sure-shot And Easy-to-do Work That Enables You To Create A Better Future — From The Comfort Of Your Own Home.
                </p>
            </div>
            {/* blob for right */}
            <div className='absolute lg:top-[0px] lg:-right-[400px] h-[460px] w-[460px] bg-gradient-to-b from-purple-400 to-pink-200 rounded-full opacity-20'>
            </div>
            {/* blob for left  */}
            <div className='absolute lg:top-[240px] lg:-left-[400px] h-[600px] w-[600px] bg-gradient-to-b from-purple-400 to-pink-200 rounded-full opacity-20'>
            </div>
        </div>
        <div></div>
      </div>
    </section>
  );
};

export default Hero;