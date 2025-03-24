"use client"
import React from 'react'
import Image from 'next/image'
import { TypeAnimation } from 'react-type-animation';
import Link from 'next/link'




const HeroSection = () => {
  return (
    <section className='w-full min-h-screen'>
      <div className='w-full px-4 lg:px-12'>
        <div className='grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-12'>
            <div className='col-span-7 place-self-center text-center sm:text-left'>
              <h1 className='font-extrabold mb-4 text-4xl lg:text-6xl '><span className='text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-white'>Hello , I'm </span> 
              <br></br>
              <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                'Aria',
                1000, // wait 1s before replacing "Mice" with "Hamsters"
                'UI/UX Designer',
                1000,
                'Front-end Dev',
                1000,
                'IoT Enthusiast',
                1000
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            /> </h1>
              <p className='text-base lg:text-xl mb-6 '>Telecommunications Engineering student with a passion for CyberSecurity and a keen eye for Internet of Things.
                I'm proficient in [list of relevant skills, e.g., AWS, Arduino, Figma].Looking for opportunities to collaborate on 
                projects that involve building scalable cloud-based applications with intuitive user interfaces. </p> 
                
                <div className='flex flex-col gap-2 mb-6'>
                  <h3 className='font-bold text-xl '>Social</h3>
                    <div className='flex space-x-4   '>
                      <a href="https://instagram.com/aariarachman" >
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-instagram">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                      </a>
                      <a href ="https://linkedin.com/in/ariaaurarachman">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-linkedin">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle>
                        </svg>
                      </a>
                      <a href="https://x.com/NRacoooo">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z">
                      </path></svg>
                      </a>
                    </div>
                </div>

              <Link href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
              <button   className='rounded-full w-full sm:w-fit px-6 py-2 mr-4 bg-white hover:bg-slate-200 text-blue-800'>Collabs</button>
              </Link>
              <button className='rounded-full w-full sm:w-fit px-6 py-2 bg-transparent text-white hover:bg-slate-800 border border-white mt-2'>Download CV</button>
            </div>
            <div className='col-span-1 lg:col-span-5 place-self-center mt-4 lg:mt-0   '>
              <div className=' relative w-[250px] h-[250px] lg:w-[500px] lg:h-[500px] md:w-[300px] md:h-[300px]'>
                <Image src='/image.png' className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" width={400} height={300} alt={''} />
              </div>
            </div>
        </div>
      </div>  
    </section>
  )
}

export default HeroSection