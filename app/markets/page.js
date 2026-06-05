"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Sparklines, SparklinesLine } from "react-sparklines";

export default function CryptoMarketTable() {
  const [coins, setCoins] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const COINS_PER_PAGE = 20;

  // Get total coin count
  useEffect(() => {
    async function fetchTotalCoins() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/list"
        );

        const data = await res.json();

        setTotalPages(
          Math.ceil(data.length / COINS_PER_PAGE)
        );
      } catch (error) {
        console.error(error);
      }
    }

    fetchTotalCoins();
  }, []);

  // Fetch market page
  useEffect(() => {
    async function fetchCoins() {
      try {
        setLoading(true);

        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${COINS_PER_PAGE}&page=${currentPage}&sparkline=true`
        );

        const data = await res.json();

        setCoins(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (!search.trim()) {
      fetchCoins();
    }
  }, [currentPage, search]);

  // Search entire CoinGecko database
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!search.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        setSearchLoading(true);

        const res = await fetch(
          `https://api.coingecko.com/api/v3/search?query=${search}`
        );

        const data = await res.json();

        const coinIds = data.coins
          .slice(0, 20)
          .map((coin) => coin.id);

        if (coinIds.length === 0) {
          setSearchResults([]);
          return;
        }

        const marketRes = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds.join(",")}&sparkline=true`
        );

        const marketData = await marketRes.json();

        setSearchResults(marketData);
      } catch (error) {
        console.error(error);
      } finally {
        setSearchLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  const displayedCoins = search.trim()
    ? searchResults
    : coins;

  const pageNumbers = [];

  for (
    let i = Math.max(1, currentPage - 2);
    i <= Math.min(totalPages, currentPage + 2);
    i++
  ) {
    pageNumbers.push(i);
  }

  return (
    <section className="bg-gray-950 text-white py-16 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center mb-8">
        Crypto Market
      </h2>

      {/* Search */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search any cryptocurrency..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full max-w-md p-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      {(loading || searchLoading) && (
        <div className="text-center py-10">
          Loading...
        </div>
      )}

      {!loading && !searchLoading && (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-700 text-gray-400">
                <tr>
                  <th className="text-left py-4">Coin</th>
                  <th className="text-left">Price</th>
                  <th className="text-left">24h</th>
                  <th className="text-left">Market Cap</th>
                  <th className="text-left">Volume</th>
                  <th className="text-left">Last 7d</th>
                </tr>
              </thead>

              <tbody>
                {displayedCoins.map((coin) => (
                  <tr
                    key={coin.id}
                    className="border-b border-gray-800 hover:bg-gray-900"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={coin.image}
                          alt={coin.name}
                          width={32}
                          height={32}
                        />

                        <div>
                          <div className="font-semibold">
                            {coin.symbol.toUpperCase()}
                          </div>

                          <div className="text-sm text-gray-400">
                            {coin.name}
                          </div>
                        </div>
                      </div>
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
                      {coin.price_change_percentage_24h?.toFixed(
                        2
                      )}
                      %
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

          {/* Mobile */}
          <div className="md:hidden grid gap-4">
            {displayedCoins.map((coin) => (
              <div
                key={coin.id}
                className="bg-gray-900 p-4 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Image
                      src={coin.image}
                      alt={coin.name}
                      width={28}
                      height={28}
                    />

                    <div>
                      <div className="font-semibold">
                        {coin.symbol.toUpperCase()}
                      </div>

                      <div className="text-sm text-gray-400">
                        {coin.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div>
                      ${coin.current_price?.toLocaleString()}
                    </div>

                    <div
                      className={
                        coin.price_change_percentage_24h >= 0
                          ? "text-green-400 text-sm"
                          : "text-red-400 text-sm"
                      }
                    >
                      {coin.price_change_percentage_24h?.toFixed(
                        2
                      )}
                      %
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-sm text-gray-400">
                  Market Cap: $
                  {coin.market_cap?.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {!search.trim() && (
            <>
              <div className="flex justify-center flex-wrap gap-2 mt-10">
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.max(prev - 1, 1)
                    )
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-40"
                >
                  Previous
                </button>

                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg ${
                      page === currentPage
                        ? "bg-blue-600"
                        : "bg-gray-800"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, totalPages)
                    )
                  }
                  disabled={
                    currentPage === totalPages
                  }
                  className="px-4 py-2 bg-blue-700 rounded-lg disabled:opacity-40"
                >
                  Next
                </button>
              </div>

              <p className="text-center text-gray-500 mt-4">
                Page {currentPage} of {totalPages}
              </p>
            </>
          )}
        </>
      )}
    </section>
  );
}