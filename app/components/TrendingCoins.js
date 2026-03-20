"use client";

import { useEffect, useState } from "react";

export default function TrendingCoins() {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/search/trending")
      .then((res) => res.json())
      .then((data) => setTrending(data.coins));
  }, []);

  return (
    <div className="bg-gray-900 text-white py-12 px-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        🔥 Trending Coins
      </h2>

      <div className="grid md:grid-cols-5 gap-6">

        {trending.map((coin) => (
          <div
            key={coin.item.id}
            className="bg-gray-800 rounded-xl p-4 flex items-center gap-3 hover:bg-gray-700 transition"
          >
            <img
              src={coin.item.small}
              alt={coin.item.name}
              className="w-8 h-8"
            />

            <div>
              <p className="font-semibold">
                {coin.item.symbol}
              </p>
              <p className="text-gray-400 text-sm">
                {coin.item.name}
              </p>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}