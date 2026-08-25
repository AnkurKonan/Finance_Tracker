// import api from "./axios";
// export const getTransactions = async (
//   search = "",
//   category = "",
//   transactionType = "",
// ) => {
//   const response = await api.get("/api/transactions/", {
//     params: {
//       limit: 100,
//       search,
//       category,
//       transaction_type: transactionType,
//     },
//   });
//   return response.data;
// };
// export const createTransaction = async (transaction) => {
//   const response = await api.post("/api/transactions/", transaction);
//   return response.data;
// };
// export const updateTransaction = async (id, transaction) => {
//   const response = await api.put(`/api/transactions/${id}`, transaction);
//   return response.data;
// };
// export const deleteTransaction = async (id) => {
//   const response = await api.delete(`/api/transactions/${id}`);
//   return response.data;
// };
// export const deleteAllTransactions = async () => {
//   const response = await api.delete("/api/transactions/all");
//   return response.data;
// };

const STORAGE_KEY = "finance_tracker_transactions";

const getStoredTransactions = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to read transactions:", error);
    return [];
  }
};

const saveTransactions = (transactions) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(transactions)
  );
};

export const getTransactions = async (
  search = "",
  category = "",
  transactionType = ""
) => {
  let transactions = getStoredTransactions();

  if (search) {
    const query = search.toLowerCase();

    transactions = transactions.filter((transaction) =>
      `${transaction.description || ""} ${transaction.category || ""}`
        .toLowerCase()
        .includes(query)
    );
  }

  if (category) {
    transactions = transactions.filter(
      (transaction) => transaction.category === category
    );
  }

  if (transactionType) {
    transactions = transactions.filter(
      (transaction) =>
        transaction.transaction_type === transactionType
    );
  }

  return transactions;
};

export const createTransaction = async (transaction) => {
  const transactions = getStoredTransactions();

  const newTransaction = {
    ...transaction,
    id: Date.now(),
  };

  transactions.unshift(newTransaction);
  saveTransactions(transactions);

  return newTransaction;
};

export const updateTransaction = async (id, transaction) => {
  const transactions = getStoredTransactions();

  const updatedTransaction = {
    ...transaction,
    id,
  };

  const updatedTransactions = transactions.map((item) =>
    String(item.id) === String(id)
      ? updatedTransaction
      : item
  );

  saveTransactions(updatedTransactions);

  return updatedTransaction;
};

export const deleteTransaction = async (id) => {
  const transactions = getStoredTransactions();

  const updatedTransactions = transactions.filter(
    (transaction) =>
      String(transaction.id) !== String(id)
  );

  saveTransactions(updatedTransactions);

  return {
    message: "Transaction deleted successfully",
  };
};

export const deleteAllTransactions = async () => {
  localStorage.removeItem(STORAGE_KEY);

  return {
    message: "All transactions deleted successfully",
  };
};
