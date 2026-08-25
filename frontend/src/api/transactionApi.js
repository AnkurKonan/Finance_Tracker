import api from "./axios";
export const getTransactions = async (
  search = "",
  category = "",
  transactionType = "",
) => {
  const response = await api.get("/api/transactions/", {
    params: {
      limit: 100,
      search,
      category,
      transaction_type: transactionType,
    },
  });
  return response.data;
};
export const createTransaction = async (transaction) => {
  const response = await api.post("/api/transactions/", transaction);
  return response.data;
};
export const updateTransaction = async (id, transaction) => {
  const response = await api.put(`/api/transactions/${id}`, transaction);
  return response.data;
};
export const deleteTransaction = async (id) => {
  const response = await api.delete(`/api/transactions/${id}`);
  return response.data;
};
export const deleteAllTransactions = async () => {
  const response = await api.delete("/api/transactions/all");
  return response.data;
};
