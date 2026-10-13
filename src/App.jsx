import React, { useEffect, useMemo, useState } from "react";
import ExpenseForm from "./components/ExpenseForm.jsx";
import ExpenseInsights from "./components/ExpenseInsights.jsx";
import ExpenseList from "./components/ExpenseList.jsx";

const STORAGE_KEY = "assignment-7-expenses";

function loadExpenses() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const expenses = JSON.parse(saved);
    if (!Array.isArray(expenses)) {
      throw new Error("Saved expenses are not in the expected format.");
    }
    return expenses;
  } catch (error) {
    console.error("Unable to read saved expenses:", error);
    return [];
  }
}

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function localDateKey(date) {
  return `${monthKey(date)}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function App() {
  const [expenses, setExpenses] = useState(loadExpenses);
  const [selectedMonth, setSelectedMonth] = useState(monthKey(new Date()));
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
      setStorageError("");
    } catch (error) {
      console.error("Unable to save expenses in this browser:", error);
      setStorageError("Couldn't save changes in this browser. Check available storage.");
    }
  }, [expenses]);

  const months = useMemo(() => {
    const values = new Set([monthKey(new Date())]);
    expenses.forEach((expense) => {
      if (expense.date) values.add(expense.date.slice(0, 7));
    });
    return [...values].sort((a, b) => b.localeCompare(a));
  }, [expenses]);

  const monthExpenses = useMemo(
    () => expenses.filter((expense) => expense.date?.startsWith(selectedMonth)),
    [expenses, selectedMonth],
  );

  const total = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const previousMonth = useMemo(() => {
    const date = new Date(`${selectedMonth}-01T12:00:00`);
    date.setMonth(date.getMonth() - 1);
    return monthKey(date);
  }, [selectedMonth]);
  const previousTotal = expenses
    .filter((expense) => expense.date?.startsWith(previousMonth))
    .reduce((sum, expense) => sum + expense.amount, 0);
  const difference = previousTotal === 0
    ? null
    : Math.round(((total - previousTotal) / previousTotal) * 100);
  const selectedDate = new Date(`${selectedMonth}-01T12:00:00`);
  const daysInSelectedMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0,
  ).getDate();
  const daysForAverage = selectedMonth === monthKey(new Date())
    ? new Date().getDate()
    : daysInSelectedMonth;

  function addExpense(expense) {
    setExpenses((current) => [expense, ...current]);
  }

  function deleteExpense(id) {
    setExpenses((current) => current.filter((expense) => expense.id !== id));
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Pennywise home">
          <span className="brand-symbol" aria-hidden="true">$</span>
          <span>pennywise<span className="brand-period">.</span></span>
        </a>
        <span className="assignment-label">PERSONAL FINANCE <span>·</span> ASSIGNMENT 07</span>
      </header>

      <section className="welcome">
        <div>
          <p className="eyebrow"><span />YOUR MONEY, IN FOCUS</p>
          <h1>Know where it <span>goes.</span></h1>
          <p className="welcome-copy">A little clarity goes a long way. Keep your spending in check.</p>
        </div>
        <label className="month-picker">
          <span>VIEWING PERIOD</span>
          <select
            aria-label="Select month"
            onChange={(event) => setSelectedMonth(event.target.value)}
            value={selectedMonth}
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {new Date(`${month}-02T12:00:00`).toLocaleDateString("en", {
                  month: "long",
                  year: "numeric",
                })}
              </option>
            ))}
          </select>
        </label>
      </section>

      {storageError && <p className="storage-error" role="alert">{storageError}</p>}

      <section className="summary-grid" aria-label="Monthly spending summary">
        <article className="summary-card total-card">
          <div className="summary-topline">
            <span className="summary-label">TOTAL SPENT</span>
            <span className="summary-icon total-icon" aria-hidden="true">↗</span>
          </div>
          <p className="summary-value">₹{total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</p>
          <p className="summary-foot">
            {difference === null
              ? "Your spending this month"
              : `${Math.abs(difference)}% ${difference > 0 ? "more" : "less"} than last month`}
          </p>
        </article>
        <article className="summary-card">
          <div className="summary-topline">
            <span className="summary-label">TRANSACTIONS</span>
            <span className="summary-icon transaction-icon" aria-hidden="true">≡</span>
          </div>
          <p className="summary-value">{monthExpenses.length}</p>
          <p className="summary-foot">Recorded this month</p>
        </article>
        <article className="summary-card">
          <div className="summary-topline">
            <span className="summary-label">DAILY AVERAGE</span>
            <span className="summary-icon average-icon" aria-hidden="true">◷</span>
          </div>
          <p className="summary-value">
            ₹{(total / Math.max(daysForAverage, 1)).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </p>
          <p className="summary-foot">Based on days elapsed</p>
        </article>
      </section>

      <section className="dashboard-grid" aria-label="Expense tracking dashboard">
        <div className="main-column">
          <ExpenseInsights expenses={monthExpenses} selectedMonth={selectedMonth} />
          <ExpenseList expenses={monthExpenses} onDelete={deleteExpense} />
        </div>
        <ExpenseForm onSubmit={addExpense} />
      </section>

      <footer className="app-footer">
        <span>MADE FOR MINDFUL SPENDING</span>
        <span className="footer-separator" />
        <span>Your records stay on this device</span>
      </footer>
    </main>
  );
}
