"use client";

import { useState, useEffect } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";

export default function PriceTicker() {

  const [coins, setCoins] = useState([]);

  useEffect(() => {
    async function fetchCoins() {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true"
      );
      const data = await res.json();
      setCoins(data);
    }

    fetchCoins();

    const interval = setInterval(fetchCoins, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  return (
  <div className="bg-gray-900 text-white py-2 overflow-hidden relative">
    <div className="ticker-wrapper">
      <div className="ticker-track flex gap-10 px-6">

        {[...coins, ...coins].map((coin, index) => (
          <div key={coin.id + "-" + index} className="flex items-center gap-3">

            <img
              src={coin.image}
              alt={coin.name}
              className="w-10 h-10"
            />

            <span className="font-semibold">
              {coin.symbol.toUpperCase()}
            </span>

            <span>
              ${coin.current_price?.toLocaleString() ?? "0.00"}
            </span>

            <span
              className={(coin.price_change_percentage_24h ?? 0) >= 0
                ? "text-green-400"
                : "text-red-500"}
            >
              {coin.price_change_percentage_24h?.toFixed(2) ?? "0.00"}%
            </span>

            {coin.sparkline_in_7d?.price && (
              <Sparklines data={coin.sparkline_in_7d.price} width={50} height={20}>
                <SparklinesLine
                  color={(coin.price_change_percentage_24h ?? 0) >= 0 ? "green" : "red"}
                />
              </Sparklines>
            )}

          </div>
        ))}

      </div>
    </div>
  </div>
);
}