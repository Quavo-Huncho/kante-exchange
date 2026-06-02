export default function TradeCard({
  buyAmount,
  setBuyAmount,
  sellAmount,
  setSellAmount,
  handleBuy,
  handleSell,
  selectedCoin,
}) {
  return (
    <div className="grid gap-6 mb-6 md:grid-cols-2">

      {/* BUY */}
      <div className="bg-white p-4 rounded">
        <h2 className="font-semibold mb-2">Buy Crypto</h2>

        <input
          type="number"
          placeholder="Enter NGN"
          value={buyAmount}
          onChange={(e) => setBuyAmount(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        />

        {selectedCoin && buyAmount && (
          <p className="text-sm text-gray-500 text-center mb-2">
            You’ll get ≈{" "}
            {(
              Number(buyAmount) /
              (selectedCoin.current_price * 1600)
            ).toFixed(6)}{" "}
            {selectedCoin.symbol.toUpperCase()}
          </p>
        )}

        <button
          onClick={handleBuy}
          disabled={!selectedCoin || !buyAmount}
          className={`w-full py-2 rounded text-white ${
            !selectedCoin || !buyAmount
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          Buy {selectedCoin?.symbol?.toUpperCase() || ""}
        </button>
      </div>

      {/* SELL */}
      <div className="bg-white p-4 rounded">
        <h2 className="font-semibold mb-2">Sell Crypto</h2>

        <input
          type="number"
          placeholder="Enter Crypto Amount"
          value={sellAmount}
          onChange={(e) => setSellAmount(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        />

        <button
          onClick={handleSell}
          disabled={!selectedCoin || !sellAmount}
          className={`w-full py-2 rounded text-white ${
            !selectedCoin || !sellAmount
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          Sell {selectedCoin?.symbol?.toUpperCase() || ""}
        </button>
      </div>

    </div>
  );
}