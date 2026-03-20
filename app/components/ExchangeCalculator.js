"use client"

import { useState, useEffect } from "react"
import { FaExchangeAlt } from "react-icons/fa"

export default function ExchangeCalculator({ close }) {

  const [search, setSearch] = useState("");
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(0);
  const [swap, setSwap] = useState(false);
  const [currency, setCurrency] = useState("NGN");
  const [coins, setCoins] = useState([]);

  const NGN_RATE = 1600

  useEffect(() => {
    async function fetchCoins() {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1"
      )
      const data = await res.json()
      setCoins(data)
    }

    fetchCoins()
  }, [])

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  )

  function calculate() {
    if (!selectedCoin || !amount) return

    let value

    if (!swap) {
      value = selectedCoin.current_price * amount
      if (currency === "NGN") value *= NGN_RATE
    } else {
      value = amount / selectedCoin.current_price
      if (currency === "NGN") value /= NGN_RATE
    }

    setResult(value)
  }


  return (
    <div
      onClick={() => close && close()}
      className="fixed inset-0 bg-black/60 flex items-end md:items-center justify-center z-50"
    >

      <div onClick={(e) => e.stopPropagation()}
      className="bg-white text-black p-6 rounded-t-2xl md:rounded-xl shadow-xl w-full md:w-[380px] max-h-[85vh] overflow-y-auto transform transition-all duration-500"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          Crypto Exchange
        </h2>

        <input
          type="number"
          placeholder={swap ? `Enter ${currency}` : "Enter Crypto Amount"}
          className="border p-2 w-full mb-3 rounded"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="flex justify-center mb-3">
          <button
            onClick={() => setSwap(!swap)}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 cursor-pointer"
          >
            <FaExchangeAlt />
          </button>
        </div>

        <div className="flex justify-center gap-2 mb-3">
          <button
            onClick={() => setCurrency("NGN")}
            className={`px-3 py-1 rounded ${currency === "NGN" ? "bg-blue-900 text-white" : "bg-gray-200"}`}
          >
            NGN
          </button>

          <button
            onClick={() => setCurrency("USD")}
            className={`px-3 py-1 rounded ${currency === "USD" ? "bg-blue-900 text-white" : "bg-gray-200"}`}
          >
            USD
          </button>
        </div>

        <input
          type="text"
          placeholder="Search coin..."
          className="border p-2 w-full mb-3 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="border rounded max-h-40 overflow-y-auto">
          {filteredCoins.slice(0, 20).map((coin) => (
            <div
              key={coin.id}
              onClick={() => setSelectedCoin(coin)}
              className="p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <img src={coin.image} alt={coin.name} className="w-5 h-5" />
                <span>
                  {coin.name} ({coin.symbol.toUpperCase()})
                </span>
              </div>
              <span>${coin.current_price}</span>
            </div>
          ))}
        </div>

        {selectedCoin && (
          <p className="mt-3 text-sm text-center">
            Selected: <b>{selectedCoin.name}</b>
          </p>
        )}

        <button
          onClick={calculate}
          className="bg-blue-900 text-white w-full py-2 rounded mt-4 cursor-pointer"
        >
          Calculate
        </button>

        <p className="mt-4 font-semibold text-center">
          {swap
            ? `Crypto Value: ${result}`
            : `${currency} Value: ${currency === "NGN" ? "₦" : "$"}${result.toLocaleString()}`}
        </p>

        <button
          onClick={() => close && close()}
          className="text-red-500 mt-4 w-full cursor-pointer"
        >
          Close
        </button>

      </div>
    </div>
  )
}