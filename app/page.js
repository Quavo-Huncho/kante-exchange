"use client"
import HeroSection from "./components/HeroSection";
import PriceTicker from "./components/PriceTicker";
import CryptoMarketTable from "./components/CryptoMarketTable";
import TrendingCoins from "./components/TrendingCoins";
import TopMovers from "./components/TopMovers";
import ServiceSection from "./components/ServiceSection";
import HowItWorks from "./components/HowItWorks";
import ContactSection from "./components/ContactSection";
import TradingChart from "./components/TradingChart";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
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

export default function Home() {

  
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(0);
  const [swap, setSwap] = useState(false); // false: crypto→fiat, true: fiat→crypto
  const [currency, setCurrency] = useState("NGN"); // NGN or USD

  const NGN_RATE = 1600; // USD → NGN
  const USD_RATE = 1;    // USD base

  // Fetch coins for calculator
  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase
        .from("test")
        .select("*");

      console.log(data, error);
    }
    
    async function fetchCoins() {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
      );
      const data = await res.json();
      setCoins(data);
    }

    fetchCoins();
  }, []);

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  function calculate() {
    if (!selectedCoin || !amount) return;

    let value;
    if (!swap) {
      // Crypto → Fiat
      value = selectedCoin.current_price * amount;
      if (currency === "NGN") value *= NGN_RATE;
    } else {
      // Fiat → Crypto
      value = amount / selectedCoin.current_price;
      if (currency === "NGN") value /= NGN_RATE;
    }

    setResult(value);
  }

  return (
    <main>

      <HeroSection />
      <div className="max-w-full overflow-x-auto bg-gray-100 py-2">
        <PriceTicker />
      </div>
      <TradingChart />
      <TrendingCoins />
      <TopMovers />
      <CryptoMarketTable />
      <ServiceSection />
      <HowItWorks />
      <ContactSection />
      
    </main>
  );
}