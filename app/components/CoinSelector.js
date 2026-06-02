export default function CoinSelector({
  search,
  setSearch,
  filteredCoins,
  selectedCoin,
  setSelectedCoin,
}) {
  return (
    <div className="bg-white p-4 rounded mb-6">
      <h2 className="font-semibold mb-2">Select Coin</h2>

      <input
        placeholder="Search coin..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 w-full mb-3 rounded"
      />

      <div className="max-h-40 sm:max-h-56 overflow-y-auto border rounded">
        {filteredCoins.slice(0, 10).map((coin) => (
          <div
            key={coin.id}
            onClick={() => setSelectedCoin(coin)}
            className="cursor-pointer p-2 hover:bg-gray-100 flex justify-between items-center"
          >
            <span>
              {coin.name} ({coin.symbol.toUpperCase()})
            </span>
            <span>${coin.current_price}</span>
          </div>
        ))}
      </div>

      {selectedCoin ? (
        <div className="bg-blue-50 p-3 rounded mt-3 text-center">
          <p className="font-semibold">
            Selected: {selectedCoin.name} ({selectedCoin.symbol.toUpperCase()})
          </p>
          <p className="text-sm text-gray-600">
            ${selectedCoin.current_price} ≈ ₦
            {(selectedCoin.current_price * 1600).toLocaleString()}
          </p>
        </div>
      ) : (
        <p className="text-gray-400 text-center mt-3">
          No coin selected
        </p>
      )}
    </div>
  );
}