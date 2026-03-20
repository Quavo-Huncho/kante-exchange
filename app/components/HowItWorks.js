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

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white" id="how-it-works">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-blue-900 mb-12">How It Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          <div className="p-6 bg-blue-50 rounded-lg shadow hover:shadow-lg transition flex flex-col items-center">
            <UserPlusIcon className="h-12 w-12 text-yellow-400 mb-3"/>
            <h3 className="text-2xl font-semibold mb-2">1. Sign Up</h3>
            <p className="text-gray-700 text-center">
              Create your free account in minutes and verify your details.
            </p>
          </div>

          <div className="p-6 bg-blue-50 rounded-lg shadow hover:shadow-lg transition flex flex-col items-center">
            <ArrowsRightLeftIcon className="h-12 w-12 text-yellow-400 mb-3"/>
            <h3 className="text-2xl font-semibold mb-2">2. Choose Currency & Amount</h3>
            <p className="text-gray-700 text-center">
              Select what you want to exchange and enter the amount.
            </p>
          </div>

          <div className="p-6 bg-blue-50 rounded-lg shadow hover:shadow-lg transition flex flex-col items-center">
            <CheckCircleIcon className="h-12 w-12 text-yellow-400 mb-3"/>
            <h3 className="text-2xl font-semibold mb-2">3. Confirm & Get Paid</h3>
            <p className="text-gray-700 text-center">
              Confirm your transaction and receive your funds instantly.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}