"use client";


import React from 'react'
import { Button } from '@/components/ui/button'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'
import { HeroParallax } from '@/components/ui/hero-parallax'
import Image from 'next/image'
import { LampContainer } from '@/components/ui/lamp'
import { motion } from 'framer-motion'
import PricingSection from '@/components/home/PricingSection';
import Link from 'next/link';



const tiers  = [
  {
    name: 'Starter',
    id: 'tier-starter',
    href: '/auth/sign-in',
    description: 'All your essential business finances, taken care of.',
    price:  '15',
    features: ['Basic invoicing', 'Easy to use accounting', 'Mutli-accounts'],
    mostPopular: false,
  },
  {
    name: 'Scale',
    id: 'tier-scale',
    href: '/auth/sign-in',
    description: 'The best financial services for your thriving business.',
    price: '30',
    features: [
      'Advanced invoicing',
      'Easy to use accounting',
      'Mutli-accounts',
      'Tax planning toolkit',
      'VAT & VATMOSS filing',
      'Free bank transfers',
    ],
    mostPopular: true,
  },
  {
    name: 'Growth',
    id: 'tier-growth',
    href: '/auth/sign-in',
    description: 'Convenient features to take your business to the next level.',
    price: '60',
    features: ['Basic invoicing', 'Easy to use accounting', 'Mutli-accounts', 'Tax planning toolkit'],
    mostPopular: false,
  },

]



const data = [
  {
    title: "Moonbeam",
    link: "https://gomoonbeam.com",
    thumbnail:
      "/ad.png",
  },
  {
    title: "Cursor",
    link: "https://cursor.so",
    thumbnail:
      "/c.png",
  },
  {
    title: "Rogue",
    link: "https://userogue.com",
    thumbnail:
      "/d.png",
  },
 
  {
    title: "Editorially",
    link: "https://editorially.org",
    thumbnail:
      "/g.png",
  },
  {
    title: "Editrix AI",
    link: "https://editrix.ai",
    thumbnail:
      "/p.png",
  },
  {
    title: "Pixel Perfect",
    link: "https://app.pixelperfect.quest",
    thumbnail:
      "/r.png",
  },
 
  {
    title: "Algochurn",
    link: "https://algochurn.com",
    thumbnail:
      "/s.png",
  },
  {
    title: "Aceternity UI",
    link: "https://ui.aceternity.com",
    thumbnail:
      "/si.png",
  },
  {
    title: "Tailwind Master Kit",
    link: "https://tailwindmasterkit.com",
    thumbnail:
      "/su.png",
  },
  {
    title: "Editorially",
    link: "https://editorially.org",
    thumbnail:
      "/g.png",
  },
  {
    title: "Editrix AI",
    link: "https://editrix.ai",
    thumbnail:
      "/p.png",
  },
  {
    title: "Pixel Perfect",
    link: "https://app.pixelperfect.quest",
    thumbnail:
      "/r.png",
  },
 
  {
    title: "Algochurn",
    link: "https://algochurn.com",
    thumbnail:
      "/s.png",
  },
  {
    title: "Aceternity UI",
    link: "https://ui.aceternity.com",
    thumbnail:
      "/si.png",
  },
  {
    title: "Tailwind Master Kit",
    link: "https://tailwindmasterkit.com",
    thumbnail:
      "/su.png",
  },

];

const page = () => {

    return (
      <div>

        <div className="flex flex-col overflow-hidden">
          <ContainerScroll
            titleComponent={
              <>
                <h1 className="text-4xl font-semibold">
                  <Button
                    size={'lg'}
                    className='rounded-xl'
                  >
                    <Link href={'/auth/sign-in'} className='w-full'>
                      Get started today
                    </Link>

                  </Button>
                  <br />
                  <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                    Run your business with sportex
                  </span>
                </h1>
              </>
            }
          >
            <Image
              src={`/d.png`}
              alt="hero"
              height={720}
              width={1400}
              className="mx-auto rounded-2xl object-cover h-full object-left-top"
              draggable={false}
            />
          </ContainerScroll>
        </div>

        <HeroParallax products={data} />

        <LampContainer>
          <motion.h1
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
          >
            Plans That <br /> Fit You Best
          </motion.h1>
        </LampContainer>

        <div className='mx-auto max-w-7xl px-6 lg:px-8 py-10'>
            <PricingSection tiers={tiers} />
        </div>

      </div>
    )
}

export default page