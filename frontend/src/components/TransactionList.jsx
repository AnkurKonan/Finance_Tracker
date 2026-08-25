import { useState } from "react";
import { deleteTransaction, updateTransaction } from "../api/transactionApi";
function TransactionList({ transactions, onRefresh }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    category: "",
    description: "",
    amount: "",
    type: "income",
  });
  const handleEdit = (transaction) => {
    setEditingId(transaction.id);
    setEditForm({
      category: transaction.category,
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
    });
  };
  const handleSave = async () => {
    try {
      await updateTransaction(editingId, editForm);
      setEditingId(null);
      onRefresh();
    } catch (error) {
      console.log(error);
      alert(JSON.stringify(error.response?.data, null, 2));
    }
  };
  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete transaction?");
    if (!confirmed) return;
    try {
      await deleteTransaction(id);
      onRefresh();
    } catch (error) {
      console.log(error);
      alert(JSON.stringify(error.response?.data, null, 2));
    }
  };
  return (
    <div
      className="
      bg-white
      p-6
      rounded-xl
      shadow
      "
    >
      <h2
        className="
        text-xl
        font-bold
        mb-4
        "
      >
        Transactions
      </h2>

      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="
            border-b
            py-3
            "
        >
          {editingId === transaction.id ? (
            <div
              className="
                space-y-2
                "
            >
              <input
                className="
                  border
                  p-2
                  w-full
                  "
                value={editForm.category}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    category: e.target.value,
                  })
                }
              />

              <input
                className="
                  border
                  p-2
                  w-full
                  "
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    description: e.target.value,
                  })
                }
              />

              <input
                className="
                  border
                  p-2
                  w-full
                  "
                type="number"
                value={editForm.amount}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    amount: Number(e.target.value),
                  })
                }
              />

              <select
                className="
                  border
                  p-2
                  w-full
                  "
                value={editForm.type}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    type: e.target.value,
                  })
                }
              >
                <option value="income">Income</option>

                <option value="expense">Expense</option>
              </select>

              <div
                className="
                  flex
                  gap-2
                  "
              >
                <button
                  onClick={handleSave}
                  className="
                    bg-green-600
                    text-white
                    px-3
                    py-1
                    rounded
                    "
                >
                  Save
                </button>

                <button
                  onClick={() => setEditingId(null)}
                  className="
                    bg-gray-500
                    text-white
                    px-3
                    py-1
                    rounded
                    "
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              className="
                flex
                justify-between
                items-center
                "
            >
              <div>
                <div>{transaction.category}</div>

                <div
                  className="
                    text-sm
                    text-gray-500
                    "
                >
                  {transaction.description}
                </div>
              </div>

              <div
                className="
                  flex
                  gap-2
                  items-center
                  "
              >
                <span>
                  {transaction.type === "income" ? "+" : "-"}₹
                  {transaction.amount}
                </span>

                <button
                  onClick={() => handleEdit(transaction)}
                  className="
                    bg-yellow-500
                    text-white
                    px-3
                    py-1
                    rounded
                    "
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(transaction.id)}
                  className="
                    bg-red-500
                    text-white
                    px-3
                    py-1
                    rounded
                    "
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
export default TransactionList;
