"use client";

import { useEffect, useRef } from "react";

export default function TradingChart() {
  const container = useRef();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;

    script.onload = () => {
      new window.TradingView.widget({
        width: "100%",
        height: 500,
        symbol: "BINANCE:BTCUSDT",
        interval: "30",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#0f172a",
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: "tradingview_chart"
      });
    };

    document.body.appendChild(script);
  }, []);

  return (
    <section className="bg-gray-900 py-16 px-6">
      <h2 className="text-3xl font-bold text-white text-center mb-8">
        Live Crypto Market
      </h2>

      <div
        id="tradingview_chart"
        ref={container}
        className="max-w-6xl mx-auto"
      />
    </section>
  );
}