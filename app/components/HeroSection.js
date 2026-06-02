"use client"

import { useState } from "react";
import { SiTether } from "react-icons/si";
import ExchangeCalculator from "./ExchangeCalculator";

import {
  UserPlusIcon,
  ArrowsRightLeftIcon,
  CheckCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ShieldCheckIcon,
  ChatBubbleBottomCenterTextIcon,
  CreditCardIcon,
  BanknotesIcon,
  GiftIcon
} from "@heroicons/react/24/solid";
import { FaBitcoin, FaEthereum, FaExchangeAlt } from "react-icons/fa";


export default function HeroSection(){

 const [showCalculator, setShowCalculator] = useState(false)

 return(

<section className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-r from-blue-900 to-blue-700 text-white px-6">

<div className="flex gap-6 text-4xl sm:text-6xl mb-6">
  <FaBitcoin className="text-yellow-400 animate-bounce"/>
  <FaEthereum className="text-purple-400 animate-bounce delay-200"/>
  <SiTether className="text-green-400 animate-bounce delay-500"/>
</div>

<h1 className="text-3xl sm:text-5xl font-extrabold mb-4">
  KANTE EXCHANGE
</h1>

<p className="max-w-xl text-base sm:text-lg text-gray-200 mb-6">
  Buy and sell cryptocurrencies instantly with the best market rates.
</p>

  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6">

    <button
      onClick={()=>setShowCalculator(true)}
      className="btn-primary w-full sm:w-auto font-semibold"
    >
      Open Exchange Calculator
    </button>

    <button className="btn-secondary w-full sm:w-auto font-semibold">
      Start Trading
    </button>

  </div>

{showCalculator && (
  <ExchangeCalculator close={() => setShowCalculator(false)} />
)}

</section>

 )
}