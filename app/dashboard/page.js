"use client";

import { useEffect, useState, useMemo } from "react";
import { getUser, logout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// components
import PortfolioCard from "../components/PortfolioCard";
import DepositCard from "../components/DepositCard";
import CoinSelector from "../components/CoinSelector";
import TradeCard from "../components/TradeCard";
import Transactions from "../components/Transactions";

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [search, setSearch] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [showTransactions, setShowTransactions] = useState(false);
  const RATE = 1600;

  // ================= INIT =================
  useEffect(() => {
    async function init() {
      const currentUser = await getUser();
      if (!currentUser) return router.push("/login");

      setUser(currentUser);

      let { data } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", currentUser.id)
        .maybeSingle();

      if (!data) {
        const { data: newWallet } = await supabase
          .from("wallets")
          .insert([{ user_id: currentUser.id, balance: {} }])
          .select()
          .single();

        setWallet(newWallet);
      } else {
        setWallet(data);
      }

      const { data: txs } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });

      setTransactions(txs || []);
    }

    init();
  }, [router]);

  // ================= COINS =================
  useEffect(() => {
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

  // ================= PORTFOLIO =================
  const portfolioValue = useMemo(() => {
    if (!wallet?.balance || coins.length === 0) return 0;

    let total = 0;

    Object.entries(wallet.balance).forEach(([coin, amount]) => {
      if (coin === "ngn") total += Number(amount);
      else {
        const coinData = coins.find(
          (c) => c.symbol.toLowerCase() === coin
        );
        if (coinData) {
          total += Number(amount) * coinData.current_price * RATE;
        }
      }
    });

    return total;
  }, [wallet, coins, RATE]);

  // ================= DEPOSIT =================
  async function handleDeposit() {
    if (!depositAmount || !wallet) return;

    const amount = Number(depositAmount);

    const newBalance = {
      ...(wallet.balance || {}),
      ngn: (wallet.balance?.ngn || 0) + amount,
    };

    await supabase
      .from("wallets")
      .update({ balance: newBalance })
      .eq("user_id", user.id);

    setWallet((prev) => ({ ...prev, balance: newBalance }));

    const { data: tx } = await supabase
      .from("transactions")
      .insert([
        {
          user_id: user.id,
          type: "deposit",
          coin: "ngn",
          amount,
          price: 1,
          ngn_value: amount,
        },
      ])
      .select()
      .single();

    setTransactions((prev) => [tx, ...prev]);
    setDepositAmount("");
  }

  // ================= BUY =================
  async function handleBuy() {
    if (!selectedCoin || !buyAmount || !wallet) return;

    const ngnAmount = Number(buyAmount);
    const coinKey = selectedCoin.symbol.toLowerCase();
    const price = selectedCoin.current_price;

    const cryptoAmount = ngnAmount / (price * RATE);
    const currentBalance = wallet.balance || {};

    if ((currentBalance.ngn || 0) < ngnAmount) {
      return alert("Insufficient NGN");
    }

    const updatedBalance = {
      ...currentBalance,
      ngn: currentBalance.ngn - ngnAmount,
      [coinKey]: (currentBalance[coinKey] || 0) + cryptoAmount,
    };

    await supabase
      .from("wallets")
      .update({ balance: updatedBalance })
      .eq("user_id", user.id);

    setWallet((prev) => ({ ...prev, balance: updatedBalance }));

    const { data: tx } = await supabase
      .from("transactions")
      .insert([
        {
          user_id: user.id,
          type: "buy",
          coin: coinKey,
          amount: cryptoAmount,
          price,
          ngn_value: ngnAmount,
        },
      ])
      .select()
      .single();

    setTransactions((prev) => [tx, ...prev]);
    setBuyAmount("");
  }

  // ================= SELL =================
  async function handleSell() {
    if (!selectedCoin || !sellAmount || !wallet) return;

    const cryptoAmount = Number(sellAmount);
    const coinKey = selectedCoin.symbol.toLowerCase();
    const price = selectedCoin.current_price;

    const currentBalance = wallet.balance || {};
    const available = currentBalance[coinKey] || 0;

    if (available < cryptoAmount) {
      return alert("Insufficient balance");
    }

    const ngnValue = cryptoAmount * price * RATE;

    const updatedBalance = {
      ...currentBalance,
      ngn: (currentBalance.ngn || 0) + ngnValue,
      [coinKey]: available - cryptoAmount,
    };

    await supabase
      .from("wallets")
      .update({ balance: updatedBalance })
      .eq("user_id", user.id);

    setWallet((prev) => ({ ...prev, balance: updatedBalance }));

    const { data: tx } = await supabase
      .from("transactions")
      .insert([
        {
          user_id: user.id,
          type: "sell",
          coin: coinKey,
          amount: cryptoAmount,
          price,
          ngn_value: ngnValue,
        },
      ])
      .select()
      .single();

    setTransactions((prev) => [tx, ...prev]);
    setSellAmount("");
  }

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  if (!user) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500 text-sm">
            Welcome back, {user?.email}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg mt-3 md:mt-0"
        >
          Logout
        </button>
      </div>

      {/* MARKET STATUS STRIP */}
      <div className="bg-black text-white p-3 rounded-xl mb-6 flex items-center justify-between text-sm">
        <span>📊 Live Market: Active</span>
        <span className="text-green-400">● Connected</span>
      </div>

      {/* PORTFOLIO HERO CARD */}
      <div className="bg-gradient-to-r from-blue-900 to-black text-white p-6 rounded-2xl shadow mb-6">
        <p className="text-sm text-gray-300">Total Portfolio Value</p>
        <h2 className="text-3xl font-bold mt-2">
          ₦{portfolioValue.toLocaleString()}
        </h2>

        <p className="text-xs text-gray-400 mt-2">
          Real-time valuation based on market prices
        </p>
      </div>

      {/* QUICK STATS */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">NGN Balance</p>
          <h3 className="text-xl font-bold">
            ₦{wallet?.balance?.ngn?.toLocaleString() || 0}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Assets Held</p>
          <h3 className="text-xl font-bold">
            {Object.keys(wallet?.balance || {}).length - 1 || 0}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Transactions</p>
          <h3 className="text-xl font-bold">
            {transactions.length}
          </h3>
        </div>

      </div>

      {/* MAIN GRID */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">

        {/* LEFT COLUMN */}
        <div className="space-y-6">

          <DepositCard
            depositAmount={depositAmount}
            setDepositAmount={setDepositAmount}
            handleDeposit={handleDeposit}
          />

          <CoinSelector
            search={search}
            setSearch={setSearch}
            filteredCoins={filteredCoins}
            selectedCoin={selectedCoin}
            setSelectedCoin={setSelectedCoin}
          />

        </div>

        {/* RIGHT COLUMN */}
        <div>

          <TradeCard
            buyAmount={buyAmount}
            setBuyAmount={setBuyAmount}
            sellAmount={sellAmount}
            setSellAmount={setSellAmount}
            handleBuy={handleBuy}
            handleSell={handleSell}
            selectedCoin={selectedCoin}
          />

        </div>

      </div>


      {/* TRANSACTIONS */}
      <div className="bg-white p-6 rounded-2xl shadow">

        {/* HEADER + BUTTON */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Transactions</h3>

          <button
            onClick={() => setShowTransactions(!showTransactions)}
            className="text-sm px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            {showTransactions ? "Hide History" : "View History"}
          </button>
        </div>

        {/* CONDITIONAL RENDER */}
        {showTransactions ? (
          <Transactions transactions={transactions} />
        ) : (
          <p className="text-sm text-gray-500">
            Transaction history is hidden. Click "View History" to display.
          </p>
        )}

      </div>

    </div>
  );
}