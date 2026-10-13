import React from "react";
import { CATEGORY_COLORS } from "./ExpenseForm.jsx";

const currency = (amount) =>
  `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

function getDailyTotals(expenses, selectedMonth) {
  const daysInMonth = new Date(
    Number(selectedMonth.slice(0, 4)),
    Number(selectedMonth.slice(5, 7)),
    0,
  ).getDate();
  const totals = Array.from({ length: daysInMonth }, () => 0);
  expenses.forEach((expense) => {
    const day = Number(expense.date.slice(8, 10));
    if (day >= 1 && day <= daysInMonth) totals[day - 1] += expense.amount;
  });
  return totals;
}

export default function ExpenseInsights({ expenses, selectedMonth }) {
  const byCategory = expenses.reduce((totals, expense) => {
    totals[expense.category] = (totals[expense.category] ?? 0) + expense.amount;
    return totals;
  }, {});
  const categories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const categoryTotal = categories.reduce((sum, [, amount]) => sum + amount, 0);
  const dailyTotals = getDailyTotals(expenses, selectedMonth);
  const maxDaily = Math.max(...dailyTotals, 1);
  const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
  const visibleDays = selectedMonth === currentMonth ? new Date().getDate() : dailyTotals.length;
  const dates = [1, Math.ceil(visibleDays / 4), Math.ceil(visibleDays / 2), Math.ceil((visibleDays * 3) / 4), visibleDays]
    .filter((day, index, list) => day >= 1 && list.indexOf(day) === index);

  return (
    <section className="panel insights-panel" aria-labelledby="insights-title">
      <div className="panel-heading insights-heading">
        <div>
          <span className="panel-eyebrow">SPENDING BREAKDOWN</span>
          <h2 id="insights-title">Your insights</h2>
        </div>
        <span className="insights-period">BY CATEGORY</span>
      </div>

      {expenses.length === 0 ? (
        <div className="insights-empty">
          <span className="empty-chart-icon" aria-hidden="true">⌁</span>
          <p>Your spending picture will appear here.</p>
          <span>Add an expense to start tracking.</span>
        </div>
      ) : (
        <div className="insights-content">
          <div className="chart-wrap" aria-label="Daily expense amounts">
            <div className="chart-bars">
              {dailyTotals.slice(0, visibleDays).map((amount, index) => (
                <div className="bar-column" key={index}>
                  <span className="bar-tooltip">{currency(amount)}</span>
                  <span
                    className={`chart-bar${amount > 0 ? " has-spending" : ""}`}
                    style={{ height: `${amount > 0 ? Math.max((amount / maxDaily) * 100, 5) : 3}%` }}
                    title={`${selectedMonth}-${String(index + 1).padStart(2, "0")}: ${currency(amount)}`}
                  />
                </div>
              ))}
            </div>
            <div className="chart-axis">
              {dates.map((day) => <span key={day}>{day}</span>)}
            </div>
          </div>

          <div className="category-section">
            <div className="category-title-row">
              <span>BY CATEGORY</span>
              <span>{categories.length} {categories.length === 1 ? "CATEGORY" : "CATEGORIES"}</span>
            </div>
            <div className="category-list">
              {categories.map(([category, amount]) => (
                <div className="category-row" key={category}>
                  <span className="category-name">
                    <span className="category-dot" style={{ background: CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Other }} />
                    {category}
                  </span>
                  <span className="category-amount">{currency(amount)}</span>
                  <span className="category-share">
                    {categoryTotal > 0 ? Math.round((amount / categoryTotal) * 100) : 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
