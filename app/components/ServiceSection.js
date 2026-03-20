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
import { SiTether } from "react-icons/si";

export default function ServiceSection() {
  return (
    <section className="py-20 bg-blue-50" id="services">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-blue-900 mb-12">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col items-center">
            <ArrowsRightLeftIcon className="h-12 w-12 text-blue-900 mb-2"/>
            <h3 className="text-xl font-semibold mb-2">Currency Exchange</h3>
            <p className="text-gray-700 text-center">Convert between crypto and cash easily.</p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col items-center">
            <CurrencyDollarIcon className="h-12 w-12 text-blue-900 mb-2"/>
            <h3 className="text-xl font-semibold mb-2">BTC Exchange</h3>
            <p className="text-gray-700 text-center">Buy or sell Bitcoin securely with us.</p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col items-center">
            <CreditCardIcon className="h-12 w-12 text-blue-900 mb-2"/>
            <h3 className="text-xl font-semibold mb-2">Cash App / Zelle / PayPal / Venmo</h3>
            <p className="text-gray-700 text-center">We support multiple payment platforms for convenience.</p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col items-center">
            <GlobeAltIcon className="h-12 w-12 text-blue-900 mb-2"/>
            <h3 className="text-xl font-semibold mb-2">International Payments</h3>
            <p className="text-gray-700 text-center">Send and receive money globally with ease.</p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col items-center">
            <BanknotesIcon className="h-12 w-12 text-blue-900 mb-2"/>
            <h3 className="text-xl font-semibold mb-2">Bank Transfers</h3>
            <p className="text-gray-700 text-center">Fast and secure transfers to any bank.</p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col items-center">
            <GiftIcon className="h-12 w-12 text-blue-900 mb-2"/>
            <h3 className="text-xl font-semibold mb-2">Gift Cards</h3>
            <p className="text-gray-700 text-center">Buy or sell popular gift cards instantly.</p>
          </div>
        </div>
      </div>
    </section>
  );
}