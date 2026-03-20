"use client";

import { FaTwitter, FaTelegram, FaInstagram, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 pt-16 pb-10 px-6">

      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">

        {/* Logo / About */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Kante Exchange
          </h2>

          <p className="text-sm">
            Trade cryptocurrencies securely with fast transactions and
            competitive market prices.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            Quick Links
          </h3>

          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Home</li>
            <li className="hover:text-white cursor-pointer">Markets</li>
            <li className="hover:text-white cursor-pointer">Exchange</li>
            <li className="hover:text-white cursor-pointer">Calculator</li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            Services
          </h3>

          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Buy Crypto</li>
            <li className="hover:text-white cursor-pointer">Sell Crypto</li>
            <li className="hover:text-white cursor-pointer">Market Data</li>
            <li className="hover:text-white cursor-pointer">Trading</li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            Community
          </h3>

          <div className="flex gap-4 text-xl">

            <FaTwitter className="hover:text-white cursor-pointer" />

            <FaTelegram className="hover:text-white cursor-pointer" />

            <FaInstagram className="hover:text-white cursor-pointer" />

            <FaGithub className="hover:text-white cursor-pointer" />

          </div>
        </div>

      </div>

      {/* Bottom Line */}
      <div className="border-t border-gray-800 mt-12 pt-6 text-center text-sm">
        © {new Date().getFullYear()} Kante Exchange. All rights reserved.
      </div>

    </footer>
  );
}