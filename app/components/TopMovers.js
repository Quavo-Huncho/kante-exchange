"use client";

import { useEffect, useState } from "react";

export default function TopMovers() {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1"
    )
      .then((res) => res.json())
      .then((data) => setCoins(data));
  }, []);

  const gainers = [...coins]
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 5);

  const losers = [...coins]
    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    .slice(0, 5);

  return (
    <div className="bg-gray-950 text-white py-14 px-6">

      <h2 className="text-3xl font-bold text-center mb-10">
        Market Movers
      </h2>

      <div className="grid md:grid-cols-2 gap-10">

        {/* Top Gainers */}
        <div>
          <h3 className="text-xl font-semibold text-green-400 mb-4">
            🚀 Top Gainers
          </h3>

          {gainers.map((coin) => (
            <div
              key={coin.id}
              className="flex items-center justify-between bg-gray-900 p-3 rounded-lg mb-3"
            >
              <div className="flex items-center gap-3">
                <img src={coin.image} className="w-7 h-7" />
                <span>{coin.symbol.toUpperCase()}</span>
              </div>

              <span className="text-green-400">
                +{coin.price_change_percentage_24h?.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>

        {/* Top Losers */}
        <div>
          <h3 className="text-xl font-semibold text-red-400 mb-4">
            📉 Top Losers
          </h3>

          {losers.map((coin) => (
            <div
              key={coin.id}
              className="flex items-center justify-between bg-gray-900 p-3 rounded-lg mb-3"
            >
              <div className="flex items-center gap-3">
                <img src={coin.image} className="w-7 h-7" />
                <span>{coin.symbol.toUpperCase()}</span>
              </div>

              <span className="text-red-400">
                {coin.price_change_percentage_24h?.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}