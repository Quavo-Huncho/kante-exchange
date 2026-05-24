export default function PortfolioCard({ portfolioValue }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Portfolio Value</h2>
      <p className="text-3xl font-bold text-blue-600">
        ₦{portfolioValue.toLocaleString()}
      </p>
      <p className="text-sm text-gray-500 mt-2">
        Total portfolio value in NGN
      </p>
    </div>
  );
}