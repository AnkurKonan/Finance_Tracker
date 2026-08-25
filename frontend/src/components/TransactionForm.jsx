import { useState } from "react";
import { createTransaction } from "../api/transactionApi";
function TransactionForm({ onTransactionAdded }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("income");
  const [description, setDescription] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting...");

    try {
      const data = await createTransaction({
        amount: Number(amount),
        category,
        type,
        description,
      });

      console.log("SUCCESS:", data);

      setAmount("");
      setCategory("");
      setType("income");
      setDescription("");

      console.log("Calling refresh...");
      onTransactionAdded();
    } catch (error) {
      console.log("ERROR:", error);
      console.log("ERROR DATA:", error.response?.data);
      alert(JSON.stringify(error.response?.data, null, 2));
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="
      bg-white
      p-6
      rounded-xl
      shadow
      mb-6
      "
    >
      <h2
        className="
        text-xl
        font-bold
        mb-4
        "
      >
        Add Transaction
      </h2>
      <input
        className="
        w-full
        border
        p-2
        mb-3
        "
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        className="
        w-full
        border
        p-2
        mb-3
        "
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        className="
        w-full
        border
        p-2
        mb-3
        "
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <select
        className="
        w-full
        border
        p-2
        mb-3
        "
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="income">Income</option>

        <option value="expense">Expense</option>
      </select>

      <button
        className="
        bg-blue-600
        text-white
        px-4
        py-2
        rounded
        "
      >
        Add
      </button>
    </form>
  );
}
export default TransactionForm;
