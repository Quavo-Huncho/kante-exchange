"use client";

import { useEffect, useState } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";

export default function CryptoMarketTable() {

  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true"
    )
      .then((res) => res.json())
      .then((data) => setCoins(data));
  }, []);

  return (
    <div className="bg-gray-950 text-white py-16 px-6">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Crypto Market
      </h2>

      <div className="overflow-x-auto">
        <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search cryptocurrency..."
          className="w-full max-w-md p-3 rounded-lg bg-gray-900 border border-gray-700 text-white"
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
        />
        </div>
        <table className="w-full text-left border-collapse">

          <thead className="border-b border-gray-700 text-gray-400">
            <tr>
              <th className="py-4">Coin</th>
              <th>Price</th>
              <th>24h</th>
              <th>Market Cap</th>
              <th>Volume</th>
              <th>Last 7d</th>
            </tr>
          </thead>

          <tbody>
            {coins
              .filter(
                (coin) =>
                  coin.name.toLowerCase().includes(search) ||
                  coin.symbol.toLowerCase().includes(search)
              )
              .map((coin) => (
              <tr
                key={coin.id}
                className="border-b border-gray-800 hover:bg-gray-900 transition"
              >
                <td className="flex items-center gap-3 py-4">

                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-8 h-8"
                  />

                  <span className="font-semibold">
                    {coin.symbol.toUpperCase()}
                  </span>

                  <span className="text-gray-400 text-sm">
                    {coin.name}
                  </span>

                </td>

                <td>
                  ${coin.current_price?.toLocaleString()}
                </td>

                <td
                  className={
                    coin.price_change_percentage_24h >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </td>

                <td>
                  ${coin.market_cap?.toLocaleString()}
                </td>

                <td>
                  ${coin.total_volume?.toLocaleString()}
                </td>

                <td>
                  {coin.sparkline_in_7d?.price && (
                    <Sparklines
                      data={coin.sparkline_in_7d.price}
                      width={100}
                      height={40}
                    >
                      <SparklinesLine
                        color={
                          coin.price_change_percentage_24h >= 0
                            ? "green"
                            : "red"
                        }
                      />
                    </Sparklines>
                  )}
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}