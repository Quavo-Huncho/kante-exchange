export default function DepositCard({ depositAmount, setDepositAmount, handleDeposit }) {
  return (
    <div className="bg-white p-4 rounded mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <input
          type="number"
          aria-label="Deposit NGN"
          placeholder="Deposit NGN"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          className="border p-2 w-full sm:flex-1 rounded"
        />

        <button
          onClick={handleDeposit}
          className="btn-primary w-full sm:w-auto"
        >
          Deposit
        </button>
      </div>
    </div>
  );
}