"use client";

import { useEffect, useMemo, useState } from "react";

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

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">
          <h1 className="text-3xl font-bold text-gray-900">Expense Tracker</h1>
          <p className="mt-2 text-gray-600">
            Manage your expenses, track your spending, and stay organized.
          </p>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold text-gray-900">Total Spent</h2>
            <p className="mt-3 text-3xl font-bold text-green-600">
              ${total.toFixed(2)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold text-gray-900">
              Filtered Total
            </h2>
            <p className="mt-3 text-3xl font-bold text-blue-600">
              ${filteredTotal.toFixed(2)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              Filter by Category
            </h2>
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
        </div>

        <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Add New Expense
          </h2>

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

        <div className="rounded-2xl bg-white p-6 shadow-md">
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Expense History
            </h2>
            <p className="text-sm text-gray-500">
              Showing {filteredExpenses.length} expense
              {filteredExpenses.length !== 1 ? "s" : ""}
            </p>
          </div>

          {filteredExpenses.length === 0 ? (
            <p className="text-gray-500">No expenses found for this category.</p>
          ) : (
            <div className="space-y-4">
              {filteredExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {expense.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {expense.category} • {expense.date}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-900">
                      ${expense.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}