"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Expense = {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
};

const categories = ["Food", "Travel", "Bills", "Shopping", "Health", "Other"];

export default function Home() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses");

    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("expenses", JSON.stringify(expenses));
    }
  }, [expenses, isLoaded]);

  const filteredExpenses = useMemo(() => {
    if (selectedCategory === "All") {
      return expenses;
    }

    return expenses.filter((expense) => expense.category === selectedCategory);
  }, [expenses, selectedCategory]);

  const total = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const filteredTotal = useMemo(() => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [filteredExpenses]);

  const recentExpenseTitle = useMemo(() => {
    return expenses.length > 0 ? expenses[0].title : "No recent expense";
  }, [expenses]);

    const highestExpense = useMemo(() => {
    if (expenses.length === 0) return null;

    return expenses.reduce((highest, current) =>
      current.amount > highest.amount ? current : highest
    );
  }, [expenses]);

  const averageExpense = useMemo(() => {
    if (expenses.length === 0) return 0;

    return total / expenses.length;
  }, [expenses, total]);

  const topCategory = useMemo(() => {
    if (expenses.length === 0) return "No data";

    const categoryTotals: Record<string, number> = {};

    expenses.forEach((expense) => {
      categoryTotals[expense.category] =
        (categoryTotals[expense.category] || 0) + expense.amount;
    });

    return Object.entries(categoryTotals).reduce((top, current) =>
      current[1] > top[1] ? current : top
    )[0];
  }, [expenses]);

  const monthlyChartData = useMemo(() => {
    const monthlyTotals: Record<string, number> = {};

    expenses.forEach((expense) => {
      if (!expense.date) return;

      const dateObject = new Date(expense.date);
      const monthLabel = dateObject.toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });

      monthlyTotals[monthLabel] =
        (monthlyTotals[monthLabel] || 0) + expense.amount;
    });

    return Object.entries(monthlyTotals).map(([month, totalAmount]) => ({
      month,
      totalAmount,
    }));
  }, [expenses]);

  const handleAddExpense = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !amount.trim() || !date.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    const numericAmount = Number(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert("Please enter a valid amount greater than 0.");
      return;
    }

    const newExpense: Expense = {
      id: Date.now(),
      title: title.trim(),
      amount: numericAmount,
      category,
      date,
    };

    setExpenses((prev) => [newExpense, ...prev]);
    setTitle("");
    setAmount("");
    setCategory("Food");
    setDate("");
  };

  const handleDeleteExpense = (id: number) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  const handleClearAll = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete all expenses?"
    );

    if (confirmed) {
      setExpenses([]);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 rounded-3xl bg-white p-6 shadow-md">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
                Personal Finance Dashboard
              </p>
              <h1 className="mt-1 text-3xl font-bold text-gray-900">
                Expense Tracker
              </h1>
              <p className="mt-2 text-gray-600">
                Add, filter, and manage your daily expenses in one place.
              </p>
            </div>

            <div className="rounded-2xl bg-gray-100 px-4 py-3">
              <p className="text-sm text-gray-500">Most Recent Expense</p>
              <p className="mt-1 font-semibold text-gray-900">
                {recentExpenseTitle}
              </p>
            </div>
          </div>
        </header>

        <section className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm font-medium text-gray-500">Total Spent</p>
            <p className="mt-3 text-3xl font-bold text-green-600">
              ${total.toFixed(2)}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm font-medium text-gray-500">Filtered Total</p>
            <p className="mt-3 text-3xl font-bold text-blue-600">
              ${filteredTotal.toFixed(2)}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm font-medium text-gray-500">Total Entries</p>
            <p className="mt-3 text-3xl font-bold text-gray-900">
              {expenses.length}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm font-medium text-gray-500">Highest Expense</p>
            <p className="mt-3 text-2xl font-bold text-red-500">
              {highestExpense ? `$${highestExpense.amount.toFixed(2)}` : "$0.00"}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              {highestExpense ? highestExpense.title : "No expenses added yet"}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm font-medium text-gray-500">Average Expense</p>
            <p className="mt-3 text-2xl font-bold text-purple-600">
              ${averageExpense.toFixed(2)}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Based on all recorded expenses
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <p className="text-sm font-medium text-gray-500">Top Category</p>
            <p className="mt-3 text-2xl font-bold text-orange-500">
              {topCategory}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Category with the highest total spend
            </p>
          </div>
        </section>

        <section className="mb-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-md lg:col-span-2">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Add New Expense
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Enter expense details below.
              </p>
            </div>

            <form onSubmit={handleAddExpense} className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="Expense title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
              />

              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
              />

              <button
                type="submit"
                className="rounded-xl bg-black px-4 py-3 font-medium text-white transition hover:opacity-90 md:col-span-2"
              >
                Add Expense
              </button>
            </form>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <h2 className="text-xl font-semibold text-gray-900">Controls</h2>
            <p className="mt-1 text-sm text-gray-500">
              Filter your expenses or clear the list.
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Filter by Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
                >
                  <option value="All">All</option>
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleClearAll}
                disabled={expenses.length === 0}
                className="w-full rounded-xl bg-red-500 px-4 py-3 font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear All Expenses
              </button>
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-3xl bg-white p-6 shadow-md">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Monthly Spending Overview
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              A quick view of how much you spent each month.
            </p>
          </div>

          {monthlyChartData.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center">
              <h3 className="text-lg font-semibold text-gray-800">
                No chart data available yet
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Add expenses with dates to see your monthly spending chart.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <BarChart
                width={800}
                height={320}
                data={monthlyChartData}
                margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalAmount" radius={[8, 8, 0, 0]} />
              </BarChart>
            </div>
          )}
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-md">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Expense History
              </h2>
              <p className="text-sm text-gray-500">
                Showing {filteredExpenses.length} expense
                {filteredExpenses.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {filteredExpenses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center">
              <h3 className="text-lg font-semibold text-gray-800">
                No expenses to display
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Add your first expense or change the selected category filter.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex flex-col gap-4 rounded-2xl border border-gray-200 p-4 transition hover:shadow-sm md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {expense.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {expense.category} • {expense.date}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-900">
                      ${expense.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-8 text-center text-sm text-gray-500">
          Built with Next.js and Tailwind CSS.
        </footer>
      </div>
    </main>
  );
}