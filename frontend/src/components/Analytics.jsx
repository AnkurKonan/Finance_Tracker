import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

function Analytics({ transactions }) {
  const categoryData = [];

  const categoryMap = {};

  transactions.forEach((t) => {
    if (t.type === "expense") {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    }
  });

  for (const key in categoryMap) {
    categoryData.push({
      name: key,
      value: categoryMap[key],
    });
  }

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const summary = [
    {
      name: "Income",
      amount: income,
    },
    {
      name: "Expense",
      amount: expense,
    },
  ];

  return (
    <div
      className="
      grid
      md:grid-cols-2
      gap-6
      mb-6
      "
    >
      <div
        className="
        bg-white
        p-4
        rounded-xl
        shadow
        "
      >
        <h2
          className="
          text-lg
          font-bold
          mb-4
          "
        >
          Expense Categories
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {categoryData.map((_, index) => (
                <Cell key={index} />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div
        className="
        bg-white
        p-4
        rounded-xl
        shadow
        "
      >
        <h2
          className="
          text-lg
          font-bold
          mb-4
          "
        >
          Income vs Expense
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={summary}>
            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="amount" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Analytics;
