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
    <section className="py-20 bg-blue-50" id="contact">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-blue-900 mb-12">Contact Us</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition flex items-center gap-4">
            <PhoneIcon className="h-8 w-8 text-blue-900"/>
            <div>
              <h3 className="text-xl font-semibold">Phone</h3>
              <p className="text-gray-700">+234 800 123 4567</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition flex items-center gap-4">
            <EnvelopeIcon className="h-8 w-8 text-blue-900"/>
            <div>
              <h3 className="text-xl font-semibold">Email</h3>
              <p className="text-gray-700">support@kanteexchange.com</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition flex items-center gap-4">
            <PhoneIcon className="h-8 w-8 text-blue-900"/>
            <div>
              <h3 className="text-xl font-semibold">WhatsApp</h3>
              <p className="text-gray-700">+234 900 987 6543</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition flex items-center gap-4">
            <GlobeAltIcon className="h-8 w-8 text-blue-900"/>
            <div>
              <h3 className="text-xl font-semibold">Website</h3>
              <p className="text-gray-700">www.kanteexchange.com</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}