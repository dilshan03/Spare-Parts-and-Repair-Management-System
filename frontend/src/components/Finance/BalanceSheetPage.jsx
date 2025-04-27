const BalanceSheetPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-xl mx-auto text-center space-y-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Balance Sheet Management
      </h2>
      <div className="flex flex-col gap-6">
        <button
          onClick={() => navigate("/balance-sheets")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow transition-all"
        >
          📄 View Balance Sheets
        </button>
        <button
          onClick={() => navigate("/balance-sheets/add")}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow transition-all"
        >
          ➕ Add New Balance Sheet
        </button>
        <button
          onClick={() => navigate("/balance-sheets/dashboard")}
          className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg shadow transition-all"
        >
          📊 Finance Dashboard
        </button>
      </div>
    </div>
  );
};

export default BalanceSheetPage;
