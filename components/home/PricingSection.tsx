import React from 'react'
import { cn } from '@/lib/utils'
import { CheckIcon } from 'lucide-react'
import Link from 'next/link'


type data = {
    id: string,
    mostPopular: boolean,
    name: string,
    description: string,
    price: string,
    features: string[]
}

type Props = {
    tiers: data[]
}


const PricingSection = ({ tiers } : Props) => {
  return (
    <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
    {tiers.map((tier) => (
        <div
        key={tier.id}
        className={cn(
            tier.mostPopular ? 'bg-white/5 ring-2 ring-primary' : 'ring-1 ring-white/10',
            'rounded-3xl p-8 xl:p-10'
        )}
        >
        <div className="flex items-center justify-between gap-x-4">
            <h3 id={tier.id.toString()} className="text-lg font-semibold leading-8 text-white">
            {tier.name}
            </h3>
            {tier.mostPopular ? (
            <p className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold leading-5 text-white">
                Most popular
            </p>
            ) : null}
        </div>
        <p className="mt-4 text-sm leading-6 text-gray-300">{tier.description}</p>
        <p className="mt-6 flex items-baseline gap-x-1">
            <span className="text-4xl font-bold tracking-tight text-white">{"$"+tier.price}</span>
            <span className="text-sm font-semibold leading-6 text-gray-300">/month</span>
        </p>
        <Link
            href={'/auth/sign-up'}
            aria-describedby={tier.id}
            className={cn(
            tier.mostPopular
                ? 'bg-primary text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500'
                : 'bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white',
            'mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
            )}
        >
            Get started
        </Link>
        <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-300 xl:mt-10">
            {tier.features.map((feature) => (
            <li key={feature} className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-white" aria-hidden="true" />
                {feature}
            </li>
            ))}
        </ul>
        </div>
    ))}
</div>
  )
}

export default PricingSection