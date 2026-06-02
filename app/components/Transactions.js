export default function Transactions({ transactions }) {
  return (
    <div className="bg-white p-4 rounded">
      <h2 className="mb-3 font-bold">Transaction History</h2>

      {transactions.length === 0 ? (
        <p className="text-gray-400 text-center">No transactions yet</p>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex flex-col sm:flex-row sm:justify-between border-b pb-2"
            >
              <div>
                <p className="font-semibold">
                  {tx.type.toUpperCase()} {tx.coin.toUpperCase()}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(tx.created_at).toLocaleString()}
                </p>
              </div>

              <div className="text-right mt-2 sm:mt-0">
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
  );
}