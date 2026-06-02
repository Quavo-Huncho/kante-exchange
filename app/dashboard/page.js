"use client";

import { useEffect, useState, useMemo } from "react";
import { getUser, logout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

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

  const portfolioValue = useMemo(() => {
    if (!wallet?.balance || coins.length === 0) return 0;

    let total = 0;

    Object.entries(wallet.balance).forEach(([coin, amount]) => {
      if (coin === "ngn") {
        total += Number(amount);
        return;
      }

      const coinData = coins.find(
        (c) => c.symbol.toLowerCase() === coin
      );

      if (coinData) {
        total += Number(amount) * coinData.current_price * RATE;
      }
    });

    return total;
  }, [wallet, coins, RATE]);

  async function handleDeposit() {
    if (!depositAmount || !wallet || !user) return;

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

  async function handleBuy() {
    if (!selectedCoin || !buyAmount || !wallet || !user) return;

    const ngnAmount = Number(buyAmount);
    const coinKey = selectedCoin.symbol.toLowerCase();
    const price = selectedCoin.current_price;
    const cryptoAmount = ngnAmount / (price * RATE);
    const currentBalance = wallet.balance || {};

    if ((currentBalance.ngn || 0) < ngnAmount) {
      alert("Insufficient NGN");
      return;
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

  async function handleSell() {
    if (!selectedCoin || !sellAmount || !wallet || !user) return;

    const cryptoAmount = Number(sellAmount);
    const coinKey = selectedCoin.symbol.toLowerCase();
    const price = selectedCoin.current_price;
    const currentBalance = wallet.balance || {};
    const available = currentBalance[coinKey] || 0;

    if (available < cryptoAmount) {
      alert("Insufficient balance");
      return;
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

  if (!user) return <div className="p-6 sm:p-10">Loading...</div>;

  return (
    <div className="px-4 py-5 sm:px-6 sm:py-6 bg-gray-100 min-h-screen">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Dashboard
            </p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-gray-500 break-all">
              {user.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 sm:w-auto"
          >
            Logout
          </button>
        </div>

        <div className="flex flex-col gap-2 rounded-2xl bg-black px-4 py-3 text-sm text-white sm:flex-row sm:items-center sm:justify-between">
          <span>📊 Live Market: Active</span>
          <span className="text-green-400">● Connected</span>
        </div>

        <section className="rounded-[28px] bg-gradient-to-r from-blue-900 to-black px-5 py-6 text-white shadow-lg sm:px-6">
          <p className="text-sm text-gray-200">Total Portfolio Value</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            <span className="break-words">₦{portfolioValue.toLocaleString()}</span>
          </h2>
          <p className="mt-2 text-xs text-gray-300 sm:text-sm">
            Real-time valuation based on market prices
          </p>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
            <p className="text-sm text-gray-500">NGN Balance</p>
            <h3 className="mt-2 text-xl font-bold text-gray-900">
              <span className="break-words">₦{wallet?.balance?.ngn?.toLocaleString() || 0}</span>
            </h3>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
            <p className="text-sm text-gray-500">Assets Held</p>
            <h3 className="mt-2 text-xl font-bold text-gray-900">
              {Object.keys(wallet?.balance || {}).length - 1 || 0}
            </h3>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-5 sm:col-span-2 xl:col-span-1">
            <p className="text-sm text-gray-500">Transactions</p>
            <h3 className="mt-2 text-xl font-bold text-gray-900">
              {transactions.length}
            </h3>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <div className="space-y-5">
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

        <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Transactions</h3>
              <p className="text-sm text-gray-500">
                Your most recent activity is shown below.
              </p>
            </div>

            <button
              onClick={() => setShowTransactions(!showTransactions)}
              className="w-full rounded-xl bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200 sm:w-auto"
            >
              {showTransactions ? "Hide History" : "View History"}
            </button>
          </div>

          <div className="mt-4">
            {showTransactions ? (
              <Transactions transactions={transactions} />
            ) : (
              <p className="rounded-xl bg-gray-50 px-4 py-4 text-sm text-gray-500">
                Transaction history is hidden. Tap “View History” to see it.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}