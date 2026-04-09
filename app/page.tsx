"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
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
const panelClass =
  "rounded-3xl border border-slate-200/70 bg-white/85 shadow-[0_16px_45px_-30px_rgba(15,23,42,0.45)] backdrop-blur-sm";
const fieldClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100";

export default function Home() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      try {
        const savedExpenses = localStorage.getItem("expenses");

        if (savedExpenses) {
          const parsedExpenses: Expense[] = JSON.parse(savedExpenses);

          if (Array.isArray(parsedExpenses)) {
            setExpenses(parsedExpenses);
          }
        }
      } catch {
        localStorage.removeItem("expenses");
      } finally {
        setIsLoaded(true);
      }
    }, 0);

    return () => {
      window.clearTimeout(loadTimer);
    };
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("expenses", JSON.stringify(expenses));
      } catch {
        // Intentionally ignored so UI stays usable when storage is unavailable.
      }
    }
  }, [expenses, isLoaded]);

  const currencyFormatter = useMemo(() => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });
  }, []);

  const formatCurrency = (value: number) => {
    return currencyFormatter.format(value);
  };

  const formatDate = (value: string) => {
    if (!value) return "No date";

    const parsedDate = new Date(`${value}T00:00:00`);
    if (Number.isNaN(parsedDate.getTime())) return value;

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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

      const monthKey = expense.date.slice(0, 7);
      if (!monthKey) return;

      monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + expense.amount;
    });

    return Object.entries(monthlyTotals)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([monthKey, totalAmount]) => {
        const parsedDate = new Date(`${monthKey}-01T00:00:00`);
        const monthLabel = Number.isNaN(parsedDate.getTime())
          ? monthKey
          : parsedDate.toLocaleString("en-US", {
              month: "short",
              year: "numeric",
            });

        return {
          month: monthLabel,
          totalAmount,
        };
      });
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

    if (editingExpenseId !== null) {
      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === editingExpenseId
            ? {
                ...expense,
                title: title.trim(),
                amount: numericAmount,
                category,
                date,
              }
            : expense
        )
      );
      setEditingExpenseId(null);
    } else {
      const newExpense: Expense = {
        id: Date.now(),
        title: title.trim(),
        amount: numericAmount,
        category,
        date,
      };

      setExpenses((prev) => [newExpense, ...prev]);
    }

    setTitle("");
    setAmount("");
    setCategory("Food");
    setDate("");
  };

  const handleDeleteExpense = (id: number) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));

    if (editingExpenseId === id) {
      handleCancelEdit();
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setTitle(expense.title);
    setAmount(expense.amount.toString());
    setCategory(expense.category);
    setDate(expense.date);
    setEditingExpenseId(expense.id);
  };

  const handleCancelEdit = () => {
    setTitle("");
    setAmount("");
    setCategory("Food");
    setDate("");
    setEditingExpenseId(null);
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
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_#dff4ff_0%,_#eff6ff_35%,_#f8fafc_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_12%_14%,rgba(8,145,178,0.24),transparent_52%),radial-gradient(circle_at_82%_20%,rgba(245,158,11,0.17),transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl space-y-6">
        <header
          className={`${panelClass} overflow-hidden p-6 sm:p-8 motion-safe:animate-[rise_0.5s_ease-out]`}
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700/80">
                Personal Finance Dashboard
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Expense Tracker
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                Track daily spending, keep category totals visible, and stay on
                top of where your money goes.
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-100 bg-cyan-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                Most Recent Expense
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {recentExpenseTitle}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {expenses.length} total {expenses.length === 1 ? "entry" : "entries"}
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div
            className={`${panelClass} p-5 motion-safe:animate-[rise_0.55s_ease-out]`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Total Spent
            </p>
            <p className="mt-3 text-2xl font-semibold text-emerald-700 sm:text-3xl">
              {formatCurrency(total)}
            </p>
            <p className="mt-2 text-sm text-slate-500">Across all categories</p>
          </div>

          <div
            className={`${panelClass} p-5 motion-safe:animate-[rise_0.62s_ease-out]`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Filtered Total
            </p>
            <p className="mt-3 text-2xl font-semibold text-cyan-700 sm:text-3xl">
              {formatCurrency(filteredTotal)}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Current category view: {selectedCategory}
            </p>
          </div>

          <div
            className={`${panelClass} p-5 motion-safe:animate-[rise_0.69s_ease-out]`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Average Expense
            </p>
            <p className="mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
              {formatCurrency(averageExpense)}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Based on all recorded entries
            </p>
          </div>

          <div
            className={`${panelClass} p-5 motion-safe:animate-[rise_0.76s_ease-out]`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Total Entries
            </p>
            <p className="mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
              {expenses.length}
            </p>
            <p className="mt-2 text-sm text-slate-500">Expense records stored</p>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <section className="space-y-6">
            <section className={`${panelClass} p-6 sm:p-7`}>
              <div className="mb-5">
                <h2 className="text-xl font-semibold text-slate-900">
                  {editingExpenseId !== null ? "Edit Expense" : "Add New Expense"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {editingExpenseId !== null
                    ? "Update the selected expense details and save changes."
                    : "Add a new entry with title, amount, category, and date."}
                </p>
              </div>

              <form
                onSubmit={handleAddExpense}
                className="grid gap-4 md:grid-cols-2"
              >
                <input
                  type="text"
                  placeholder="Expense title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={fieldClass}
                />

                <input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={fieldClass}
                />

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={fieldClass}
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
                  className={fieldClass}
                />

                <div className="flex flex-wrap gap-3 md:col-span-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                  >
                    {editingExpenseId !== null ? "Update Expense" : "Add Expense"}
                  </button>

                  {editingExpenseId !== null && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </section>

            <section className={`${panelClass} p-6 sm:p-7`}>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Monthly Spending Overview
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Your spending trend by month.
                  </p>
                </div>
              </div>

              {monthlyChartData.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                  <h3 className="text-lg font-semibold text-slate-800">
                    No chart data available yet
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Add expenses with dates to generate a monthly chart.
                  </p>
                </div>
              ) : (
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyChartData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="4 4" stroke="#dbe5ef" />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#475569", fontSize: 12 }}
                      />
                      <YAxis
                        tickFormatter={(value: number) => `$${value}`}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#475569", fontSize: 12 }}
                        width={50}
                      />
                      <Tooltip
                        formatter={(value) => formatCurrency(Number(value))}
                        cursor={{ fill: "rgba(8, 145, 178, 0.08)" }}
                        contentStyle={{
                          borderRadius: "0.9rem",
                          borderColor: "#cbd5e1",
                          boxShadow: "0 20px 40px -30px rgba(15, 23, 42, 0.5)",
                        }}
                      />
                      <Bar
                        dataKey="totalAmount"
                        fill="#0891b2"
                        radius={[10, 10, 2, 2]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </section>

            <section className={`${panelClass} p-6 sm:p-7`}>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Expense History
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Showing {filteredExpenses.length} expense
                    {filteredExpenses.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>

              {filteredExpenses.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                  <h3 className="text-lg font-semibold text-slate-800">
                    No expenses to display
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Add your first expense or change the selected category.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredExpenses.map((expense, index) => (
                    <article
                      key={expense.id}
                      className="rounded-2xl border border-slate-200/90 bg-white p-4 transition hover:border-cyan-200 hover:shadow-[0_10px_30px_-24px_rgba(8,145,178,0.8)] motion-safe:animate-[rise_0.45s_ease-out]"
                      style={{ animationDelay: `${Math.min(index * 40, 320)}ms` }}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-base font-semibold text-slate-900">
                            {expense.title}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {expense.category} / {formatDate(expense.date)}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="mr-2 text-lg font-semibold text-slate-900">
                            {formatCurrency(expense.amount)}
                          </span>
                          <button
                            onClick={() => handleEditExpense(expense)}
                            className="rounded-xl bg-cyan-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-cyan-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="rounded-xl bg-rose-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-rose-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </section>

          <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
            <section className={`${panelClass} p-6`}>
              <h2 className="text-xl font-semibold text-slate-900">Controls</h2>
              <p className="mt-1 text-sm text-slate-500">
                Filter expenses and manage your list.
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Filter by Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={fieldClass}
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
                  className="w-full rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Clear All Expenses
                </button>
              </div>
            </section>

            <section className={`${panelClass} p-6`}>
              <h2 className="text-xl font-semibold text-slate-900">
                Spending Snapshot
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Quick highlights from your data.
              </p>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Highest Expense
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {highestExpense
                      ? formatCurrency(highestExpense.amount)
                      : formatCurrency(0)}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {highestExpense ? highestExpense.title : "No expenses yet"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Top Category
                  </p>
                  <p className="mt-2 text-lg font-semibold text-amber-600">
                    {topCategory}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Category with the highest spend total
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>

        <footer className="pb-2 text-center text-sm text-slate-500">
          Built with Next.js and Tailwind CSS.
        </footer>
      </div>
    </main>
  );
}
