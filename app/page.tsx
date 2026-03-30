"use client";

import { useMemo, useState } from "react";

type Expense = {
  id: number;
  title: string;
  amount: number;
  category: string;
};

export default function Home() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const total = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const handleAddExpense = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !amount.trim() || !category.trim()) {
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
      category: category.trim(),
    };

    setExpenses((prev) => [newExpense, ...prev]);
    setTitle("");
    setAmount("");
    setCategory("");
  };

  const handleDeleteExpense = (id: number) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">
          <h1 className="text-3xl font-bold text-gray-900">Expense Tracker</h1>
          <p className="mt-2 text-gray-600">
            Track your daily spending in a simple and organized way.
          </p>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-md md:col-span-1">
            <h2 className="text-lg font-semibold text-gray-900">Total Spent</h2>
            <p className="mt-3 text-3xl font-bold text-green-600">
              ${total.toFixed(2)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md md:col-span-2">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Add New Expense
            </h2>

            <form onSubmit={handleAddExpense} className="grid gap-4">
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

              <input
                type="text"
                placeholder="Category (e.g. Food, Travel, Bills)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-500"
              />

              <button
                type="submit"
                className="rounded-xl bg-black px-4 py-3 font-medium text-white transition hover:opacity-90"
              >
                Add Expense
              </button>
            </form>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Expense History
          </h2>

          {expenses.length === 0 ? (
            <p className="text-gray-500">No expenses added yet.</p>
          ) : (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex flex-col gap-3 rounded-xl border border-gray-200 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {expense.title}
                    </h3>
                    <p className="text-sm text-gray-500">{expense.category}</p>
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