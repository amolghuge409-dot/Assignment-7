import React from "react";
import { CATEGORY_COLORS } from "./ExpenseForm.jsx";

const currency = (amount) =>
  `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export default function ExpenseList({ expenses, onDelete }) {
  const sortedExpenses = [...expenses].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  return (
    <section className="panel list-panel" aria-labelledby="expenses-title">
      <div className="panel-heading list-heading">
        <div>
          <span className="panel-eyebrow">RECENT ACTIVITY</span>
          <h2 id="expenses-title">Expenses</h2>
        </div>
        <span className="expense-count">{expenses.length} {expenses.length === 1 ? "ENTRY" : "ENTRIES"}</span>
      </div>

      {sortedExpenses.length === 0 ? (
        <div className="list-empty">
          <span aria-hidden="true">✳</span>
          <p>No expenses for this month yet.</p>
          <span>Your new entries will show up here.</span>
        </div>
      ) : (
        <ul className="expense-list">
          {sortedExpenses.map((expense) => (
            <li className="expense-item" key={expense.id}>
              <span
                className="expense-category-icon"
                style={{ "--category-color": CATEGORY_COLORS[expense.category] ?? CATEGORY_COLORS.Other }}
                aria-hidden="true"
              >
                {expense.category === "Food & Drink" ? "F" : expense.category[0]}
              </span>
              <span className="expense-description">
                <strong>{expense.title}</strong>
                <span>{expense.category} <span className="description-dot">·</span> {new Date(`${expense.date}T12:00:00`).toLocaleDateString("en", { month: "short", day: "numeric" })}</span>
              </span>
              <span className="expense-amount">−{currency(expense.amount)}</span>
              <button
                aria-label={`Delete ${expense.title}`}
                className="delete-button"
                onClick={() => onDelete(expense.id)}
                title={`Delete ${expense.title}`}
                type="button"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
