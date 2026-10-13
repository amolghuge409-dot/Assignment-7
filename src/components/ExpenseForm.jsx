import React, { useState } from "react";

export const CATEGORIES = [
  "Food & Drink",
  "Transport",
  "Shopping",
  "Bills",
  "Health",
  "Entertainment",
  "Education",
  "Other",
];

export const CATEGORY_COLORS = {
  "Food & Drink": "#ee9b55",
  Transport: "#6489cf",
  Shopping: "#aa7bd0",
  Bills: "#dd7181",
  Health: "#51a98a",
  Entertainment: "#d2a547",
  Education: "#6484a7",
  Other: "#9399a4",
};

const initialValues = {
  title: "",
  amount: "",
  category: CATEGORIES[0],
  date: localDateKey(new Date()),
};

function localDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function ExpenseForm({ onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [validationError, setValidationError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setValidationError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    const amount = Number(values.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setValidationError("Enter an amount greater than zero.");
      return;
    }

    onSubmit({
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
      title: values.title.trim(),
      amount,
      category: values.category,
      date: values.date,
    });
    setValues({ ...initialValues, date: localDateKey(new Date()) });
  }

  return (
    <section className="panel add-panel" aria-labelledby="add-title">
      <div className="panel-heading">
        <div>
          <span className="panel-eyebrow">QUICK ENTRY</span>
          <h2 id="add-title">Add an expense</h2>
        </div>
        <span className="add-mark" aria-hidden="true">+</span>
      </div>

      <form className="expense-form" onSubmit={handleSubmit}>
        <label className="input-field">
          <span>What was it for?</span>
          <input
            autoComplete="off"
            maxLength="80"
            name="title"
            onChange={handleChange}
            placeholder="e.g. Lunch with friends"
            required
            value={values.title}
          />
        </label>

        <label className="input-field">
          <span>Amount</span>
          <span className="amount-input">
            <span aria-hidden="true">₹</span>
            <input
              inputMode="decimal"
              min="0.01"
              name="amount"
              onChange={handleChange}
              placeholder="0.00"
              required
              step="0.01"
              type="number"
              value={values.amount}
            />
          </span>
        </label>

        <label className="input-field">
          <span>Category</span>
          <select name="category" onChange={handleChange} value={values.category}>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>

        <label className="input-field">
          <span>Date</span>
          <input
            max={localDateKey(new Date())}
            name="date"
            onChange={handleChange}
            required
            type="date"
            value={values.date}
          />
        </label>

        {validationError && <p className="validation-error" role="alert">{validationError}</p>}

        <button className="add-button" type="submit">
          <span>Add to expenses</span>
          <span aria-hidden="true">↗</span>
        </button>
        <p className="form-footnote">Only you can see these records on this device.</p>
      </form>
    </section>
  );
}
