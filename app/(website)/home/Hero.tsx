import React from 'react';

const Hero = () => {
  return (
    // relative and z-10 are important to place this content ON TOP of the blobs
    <section className="relative z-10 text-center  px-4" id="home">
      <div>
        <div className="flex flex-col">
            <div className='grid grid-cols-6 justify-between'>
                <div className='col-span-4 flex  flex-col mx-auto'>     
                    <h1 className="text-7xl md:text-8xl font-bold font-sans-noto tracking-tight bg-gradient-to-r from-purple-400 to-pink-200 bg-clip-text text-transparent drop-shadow-md">
                        GROW UP
                    </h1>

                    <div className="mt-6 text- text-gray-subtitle font-medium">
                        <p>Work From Home With Zero Investment</p>
                        <p>Empowering Individuals. Creating Opportunities.</p>
                    </div>
                </div>
                <div className='bg-amber-700 col-span-1 h-[200px] w-[200px]'>
                    some image
                </div>
            </div>
            <div className=''>
                <p className="mt-12 text-base font-semibold max-w-3xl mx-auto leading-relaxed text-gray-800">
                    At GROWUP Our Mission Is To Empower Individuals In India By
                    Providing Real Work-From-Home Opportunities With No Investment.
                    Whether You Are A Student, Homemaker, Retired Professional, Or
                    Someone Who Wants To Make Extra Money, We Offer Sure-Shot And
                    Easy-To-Do Work That Enables You To Create A Better Future — From
                    The Comfort Of Your Own Home.
                </p>
            </div>
        </div>
        <div></div>
      </div>
    </section>
  );
};

export default Hero;