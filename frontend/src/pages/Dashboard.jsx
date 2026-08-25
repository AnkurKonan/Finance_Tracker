import { useEffect, useState } from "react";
import Analytics from "../components/Analytics";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import { getTransactions, deleteAllTransactions } from "../api/transactionApi";
function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const loadTransactions = async () => {
    try {
      const data = await getTransactions(search, category, transactionType);
      console.log("TRANSACTIONS RECEIVED:", data);
      setTransactions(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    loadTransactions();
  }, [search, category, transactionType]);
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);
  const balance = income - expense;
  const handleDeleteAll = async () => {
    const confirmed = window.confirm("Delete ALL transactions?");
    if (!confirmed) return;
    try {
      await deleteAllTransactions();
      loadTransactions();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className="
      max-w-4xl
      mx-auto
      p-6
      "
    >
      <div
        className="
        flex
        justify-between
        items-center
        mb-6
        "
      >
        <h1
          className="
          text-3xl
          font-bold
          "
        >
          Dashboard
        </h1>

        <button
          onClick={handleDeleteAll}
          className="
          bg-red-600
          text-white
          px-4
          py-2
          rounded
          "
        >
          Delete All
        </button>
      </div>

      <div
        className="
        grid
        md:grid-cols-3
        gap-3
        mb-6
        "
      >
        <input
          className="
          border
          p-2
          rounded
          "
          placeholder="Search description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          className="
          border
          p-2
          rounded
          "
          placeholder="Category..."
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <select
          className="
          border
          p-2
          rounded
          "
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
        >
          <option value="">All Types</option>

          <option value="income">Income</option>

          <option value="expense">Expense</option>
        </select>
      </div>

      <div
        className="
        grid
        grid-cols-3
        gap-4
        mb-6
        "
      >
        <div
          className="
          bg-green-100
          p-4
          rounded
          "
        >
          <h3>Income</h3>

          <p>₹{income}</p>
        </div>

        <div
          className="
          bg-red-100
          p-4
          rounded
          "
        >
          <h3>Expense</h3>

          <p>₹{expense}</p>
        </div>

        <div
          className="
          bg-blue-100
          p-4
          rounded
          "
        >
          <h3>Balance</h3>

          <p>₹{balance}</p>
        </div>
      </div>

      <TransactionForm onTransactionAdded={loadTransactions} />
      <Analytics transactions={transactions} />
      <TransactionList
        transactions={transactions}
        onRefresh={loadTransactions}
      />
    </div>
  );
}

export default Dashboard;
