"use client";

import { useEffect, useState } from "react";
import { getUser, logout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import {supabase } from "@/lib/supabase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [wallet, setWallet] = useState(null);
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [btcPrice, setBtcPrice] = useState(0);
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [profitLoss, setProfitLoss] = useState(0);
  const [profitPercent, setProfitPercent] = useState(0);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function fetchWallet(userId) {
      // try to get wallet
      let { data, error } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle(); // ✅ FIXED (no crash)

      console.log("Wallet fetch:", data, error);

      // 🚀 If wallet doesn't exist → create one
      if (!data) {
        const { data: newWallet, error: insertError } = await supabase
          .from("wallets")
          .insert([
            {
              user_id: userId,
              btc: 0,
              eth: 0,
              usdt: 0,
              ngn: 0,
            },
          ])
          .select()
          .single();

        console.log("Created wallet:", newWallet, insertError);

        setWallet(newWallet);
      } else {
        setWallet(data);
      }
    }

    async function checkUser() {
      const currentUser = await getUser();

      if (!currentUser) {
        router.push("/login"); // 🔒 redirect if not logged in
      } else {
        setUser(currentUser);
        fetchWallet(currentUser.id);
      }
    }

    checkUser();
  }, []);

  useEffect(() => {
    async function fetchCoins() {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=50&page=1"
      );
      const data = await res.json();
      setCoins(data);
    }

    fetchCoins();
  }, []);

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    async function fetchBTCPrice() {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
      );
      const data = await res.json();

      setBtcPrice(data.bitcoin.usd);
    }

    fetchBTCPrice();

    const interval = setInterval(fetchBTCPrice, 15000); // update every 15s
    return () => clearInterval(interval);
  }, []);

  async function handleBuy() {
    if (!selectedCoin || !buyAmount) return;

    const ngnAmount = Number(buyAmount);
    const price = selectedCoin.current_price;
    const coinKey = selectedCoin.symbol.toLowerCase();

    const cryptoAmount = ngnAmount / (price * 1600);

    const currentBalance = wallet.balance || {};

    if ((currentBalance.ngn || 0) < ngnAmount) {
      alert("Insufficient NGN");
      return;
    }

    const updatedBalance = {
      ...currentBalance,
      ngn: (currentBalance.ngn || 0) - ngnAmount,
      [coinKey]: (currentBalance[coinKey] || 0) + cryptoAmount
    };

    const { data, error } = await supabase
      .from("wallets")
      .update({ balance: updatedBalance })
      .eq("user_id", user.id)
      .select()
      .single();

    if (!error) {
      setWallet(data);
    }

    await supabase.from("transactions").insert([
      {
        user_id: user.id,
        type: "buy",
        coin: coinKey,
        amount: cryptoAmount,
        price: price,
        ngn_value: ngnAmount
      }
    ]);

  }

  async function handleSell() {
    if (!selectedCoin || !sellAmount) return;

    const cryptoAmount = Number(sellAmount);
    const price = selectedCoin.current_price;
    const coinKey = selectedCoin.symbol.toLowerCase();

    const currentBalance = wallet.balance || {};

    if ((currentBalance[coinKey] || 0) < cryptoAmount) {
      alert("Insufficient balance");
      return;
    }

    const ngnValue = cryptoAmount * price * 1600;

    const updatedBalance = {
      ...currentBalance,
      ngn: (currentBalance.ngn || 0) + ngnValue,
      [coinKey]: (currentBalance[coinKey] || 0) - cryptoAmount
    };

    const { data, error } = await supabase
      .from("wallets")
      .update({ balance: updatedBalance })
      .eq("user_id", user.id)
      .select()
      .single();

    if (!error) {
      setWallet(data);
    }

    await supabase.from("transactions").insert([
      {
        user_id: user.id,
        type: "sell",
        coin: coinKey,
        amount: cryptoAmount,
        price: price,
        ngn_value: ngnValue
      }
    ]);

  }

  useEffect(() => {
    async function fetchTransactions() {
      const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setTransactions(data);
    }

    if (user) fetchTransactions();
  }, [user]);

  useEffect(() => {
    if (!wallet?.balance || coins.length === 0) return;

    let total = 0;

    Object.entries(wallet.balance).forEach(([coin, amount]) => {
      if (coin === "ngn") {
        total += Number(amount);
      } else {
        const coinData = coins.find(
          (c) => c.symbol.toLowerCase() === coin
        );

        if (coinData) {
          total += Number(amount) * coinData.current_price * 1600;
        }
      }
    });

    setPortfolioValue(total);
    }, [wallet, coins]);

    useEffect(() => {
    if (!transactions.length) return;

    let total = 0;

    transactions.forEach((tx) => {
      if (tx.type === "buy") {
        total += Number(tx.ngn_value);
      } else if (tx.type === "sell") {
        total -= Number(tx.ngn_value);
      }
    });

    setTotalInvestment(total);
  }, [transactions]);

  useEffect(() => {
    if (!portfolioValue) return;

    const profit = portfolioValue - totalInvestment;
    const percent = totalInvestment
      ? (profit / totalInvestment) * 100
      : 0;

    setProfitLoss(profit);
    setProfitPercent(percent);
  }, [portfolioValue, totalInvestment]);

  useEffect(() => {
    if (!transactions.length) return;

    let runningTotal = 0;

    const data = transactions
      .slice()
      .reverse()
      .map((tx) => {
        if (tx.type === "buy") {
          runningTotal += Number(tx.ngn_value);
        } else {
          runningTotal -= Number(tx.ngn_value);
        }

        return {
          date: new Date(tx.created_at).toLocaleDateString(),
          value: runningTotal,
        };
      });

    setChartData(data);
  }, [transactions]);

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* User Card */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Welcome 👋</h2>
        <p className="text-gray-600">Email: {user.email}</p>
      </div>

      {/* PORTFOLIO VALUE */}
      <div className="w-full bg-gradient-to-r from-blue-900 to-blue-700 text-white py-10 px-6 mb-6 rounded-xl">
        <h1 className="text-center font-bold text-5xl mb-6 text-yellow-400">My Portfolio</h1>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">

          {/* LEFT */}
          <div>
            <h2 className="text-lg text-gray-200">Total Portfolio Value</h2>

            <p className="text-4xl md:text-5xl font-bold mt-2">
              ₦{portfolioValue.toLocaleString()}
            </p>

            <p className="text-sm text-gray-300 mt-1">
              ≈ ${Math.round(portfolioValue / 1600).toLocaleString()}
            </p>
          </div>

          {/* RIGHT - PROFIT/LOSS */}
          <div className="mt-6 md:mt-0 text-center  md:text-right">

            <p className="text-lg text-gray-200">Profit / Loss</p>

            <p
              className={`text-2xl font-semibold ${
                profitLoss >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {profitLoss >= 0 ? "+" : "-"}₦
              {Math.abs(profitLoss).toLocaleString()}
            </p>

            <p
              className={`text-sm ${
                profitPercent >= 0 ? "text-green-300" : "text-red-300"
              }`}
            >
              {profitPercent.toFixed(2)}%
            </p>
            <p className="text-xs text-gray-300 mt-2">
              Initial Investment: ₦{totalInvestment.toLocaleString()}
            </p>

          </div>
          
          <div className="mt-6 md:mt-0 text-center md:text-right">
            <p className="text-lg text-gray-200">Assets</p>
            <p className="text-2xl font-semibold">
              {wallet?.balance ? Object.keys(wallet.balance).length : 0}
            </p>
          </div>

        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Portfolio Growth
        </h2>

        {chartData.length === 0 ? (
          <p className="text-gray-400 text-center">
            No data yet
          </p>
        ) : (
          <div className="w-full h-64">
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `₦${value}`} />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* MAIN GRID */}
      <div className="grid md:grid-cols-3 gap-6">


        {/* WALLET */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Your Wallet</h2>

          <div className="grid grid-cols-2 gap-4">
            {wallet?.balance && Object.keys(wallet.balance).length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(wallet.balance).map(([coin, value]) => (
                  <div key={coin} className="p-3 bg-gray-100 rounded text-center">
                    <p className="text-sm text-gray-500">{coin.toUpperCase()}</p>
                    <p className="font-semibold">
                      {coin === "ngn" ? "₦" : ""}
                      {Number(value).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center">No assets yet</p>
            )}
          </div>
        </div>

        {/* COIN SELECTOR */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Select Coin</h2>

          <input
            type="text"
            placeholder="Search coin..."
            className="border p-2 w-full mb-3 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="max-h-48 overflow-y-auto border rounded">
            {filteredCoins.slice(0, 20).map((coin) => (
              <div
                key={coin.id}
                onClick={() => setSelectedCoin(coin)}
                className="p-2 flex justify-between hover:bg-gray-100 cursor-pointer"
              >
                <span>
                  {coin.name} ({coin.symbol.toUpperCase()})
                </span>
                <span>${coin.current_price}</span>
              </div>
            ))}
          </div>

          {selectedCoin && (
            <p className="mt-3 text-center">
              Selected: <b>{selectedCoin.name}</b>
            </p>
          )}
        </div>

        {/* LIVE PRICE */}
        <div className="bg-white p-6 rounded-xl shadow flex flex-col justify-center items-center text-center">
          <h2 className="text-lg font-semibold mb-2">Live Price</h2>

          {selectedCoin ? (
            <>
              <p className="text-2xl font-bold">
                ${selectedCoin.current_price}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                ≈ ₦{(selectedCoin.current_price * 1600).toLocaleString()}
              </p>
            </>
          ) : (
            <p className="text-gray-400">Select a coin</p>
          )}
        </div>

      </div>

      {/* TRADING SECTION */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">

        {/* BUY */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Buy Crypto</h2>

          <input
            type="number"
            placeholder="Enter amount in NGN"
            className="border p-2 w-full mb-3 rounded"
            value={buyAmount}
            onChange={(e) => setBuyAmount(e.target.value)}
          />

          <button
            onClick={handleBuy}
            className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700 transition cursor-pointer"
          >
            Buy
          </button>
        </div>

        {/* SELL */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Sell Crypto</h2>

          <input
            type="number"
            placeholder="Enter crypto amount"
            className="border p-2 w-full mb-3 rounded"
            value={sellAmount}
            onChange={(e) => setSellAmount(e.target.value)}
          />

          <button
            onClick={handleSell}
            className="bg-red-500 text-white w-full py-2 rounded hover:bg-red-600 transition cursor-pointer"
          >
            Sell
          </button>
        </div>

        {/* TRANSACTION HISTORY */}
        <div className="bg-white p-6 rounded-xl shadow mt-6">
          <h2 className="text-lg font-semibold mb-4">Transaction History</h2>

          {transactions.length === 0 ? (
            <p className="text-gray-400 text-center">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex justify-between items-center p-3 bg-gray-100 rounded"
                >
                  <div>
                    <p className="font-semibold">
                      {tx.type.toUpperCase()} {tx.coin.toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(tx.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p>
                      {tx.type === "buy" ? "+" : "-"}
                      {tx.amount}
                    </p>
                    <p className="text-sm text-gray-500">
                      ₦{Number(tx.ngn_value).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}