export default function DepositCard({ depositAmount, setDepositAmount, handleDeposit }) {
  return (
    <div className="bg-white p-4 rounded mb-6">
      <input
        type="number"
        placeholder="Deposit NGN"
        value={depositAmount}
        onChange={(e) => setDepositAmount(e.target.value)}
        className="border p-2 mr-2"
      />
      <button
        onClick={handleDeposit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Deposit
      </button>
    </div>
  );
}