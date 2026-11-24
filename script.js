import {
  calculateDiscount,
  calculateExpensesTotal,
  calculateInstallment,
  simulateInvestment,
  splitExpenses,
} from "./calculations.js";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const percentage = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const expenses = [];
let nextExpenseId = 1;

function readNumber(form, name) {
  const field = form.elements.namedItem(name);
  return field && field.value.trim() !== "" ? field.valueAsNumber : Number.NaN;
}

function setFeedback(form, message = "") {
  const feedback = form.querySelector("[data-feedback]");
  if (feedback) {
    feedback.textContent = message;
  }
}

function renderResult(container, title, rows) {
  const heading = document.createElement("p");
  heading.className = "result-heading";
  heading.textContent = title;

  const list = document.createElement("dl");
  list.className = "result-list";

  rows.forEach(({ label, value, primary = false }) => {
    const item = document.createElement("div");
    item.className = primary ? "result-item result-item-primary" : "result-item";

    const term = document.createElement("dt");
    term.textContent = label;

    const description = document.createElement("dd");
    description.textContent = value;

    item.append(term, description);
    list.append(item);
  });

  container.replaceChildren(heading, list);
}

function submitDiscount(form) {
  const price = readNumber(form, "price");
  const discountPercent = readNumber(form, "percent");

  if (!Number.isFinite(price) || price <= 0) {
    setFeedback(form, "Informe um preço original maior que zero.");
    return;
  }

  if (!Number.isFinite(discountPercent) || discountPercent < 0 || discountPercent > 100) {
    setFeedback(form, "Informe um desconto entre 0% e 100%.");
    return;
  }

  const result = calculateDiscount(price, discountPercent);
  const output = form.closest(".tool-card").querySelector("[data-result]");
  renderResult(output, "Resultado do desconto", [
    { label: "Preço original", value: currency.format(result.originalPrice) },
    { label: `Economia (${percentage.format(result.percentage)}%)`, value: currency.format(result.savings) },
    { label: "Preço final", value: currency.format(result.finalPrice), primary: true },
  ]);
  setFeedback(form);
}

function submitInstallments(form) {
  const total = readNumber(form, "total");
  const count = readNumber(form, "count");

  if (!Number.isFinite(total) || total <= 0) {
    setFeedback(form, "Informe um valor total maior que zero.");
    return;
  }

  if (!Number.isInteger(count) || count < 1) {
    setFeedback(form, "A quantidade de parcelas deve ser um número inteiro maior que zero.");
    return;
  }

  const installment = calculateInstallment(total, count);
  const output = form.closest(".tool-card").querySelector("[data-result]");
  renderResult(output, "Parcelamento sem juros", [
    { label: "Valor total", value: currency.format(total) },
    { label: "Quantidade", value: `${count} ${count === 1 ? "parcela" : "parcelas"}` },
    { label: "Cada parcela", value: currency.format(installment), primary: true },
  ]);
  setFeedback(form);
}

function submitInvestment(form) {
  const initial = readNumber(form, "initial");
  const deposit = readNumber(form, "deposit");
  const rate = readNumber(form, "rate");
  const months = readNumber(form, "months");

  if (!Number.isFinite(initial) || initial < 0 || !Number.isFinite(deposit) || deposit < 0) {
    setFeedback(form, "Os valores inicial e mensal não podem ser negativos.");
    return;
  }

  if (initial === 0 && deposit === 0) {
    setFeedback(form, "Informe um valor inicial ou um aporte mensal.");
    return;
  }

  if (!Number.isFinite(rate) || rate < 0) {
    setFeedback(form, "Informe uma taxa mensal igual ou maior que zero.");
    return;
  }

  if (!Number.isInteger(months) || months < 1 || months > 1200) {
    setFeedback(form, "O período deve ser um número inteiro entre 1 e 1.200 meses.");
    return;
  }

  const result = simulateInvestment(initial, deposit, rate, months);
  const output = form.closest(".tool-card").querySelector("[data-result]");
  renderResult(output, "Estimativa ao final do período", [
    { label: "Total investido", value: currency.format(result.invested) },
    { label: "Rendimento estimado", value: currency.format(result.earnings) },
    { label: "Saldo final", value: currency.format(result.finalBalance), primary: true },
  ]);
  setFeedback(form);
}

function renderExpenseList() {
  const list = document.querySelector("#expense-list");
  const count = document.querySelector("#expense-count");
  count.textContent = `${expenses.length} ${expenses.length === 1 ? "item" : "itens"}`;

  if (expenses.length === 0) {
    const empty = document.createElement("li");
    empty.className = "expense-empty";
    empty.textContent = "Suas despesas aparecerão aqui.";
    list.replaceChildren(empty);
    return;
  }

  const items = expenses.map((expense) => {
    const item = document.createElement("li");
    item.className = "expense-row";

    const copy = document.createElement("div");
    copy.className = "expense-row-copy";

    const description = document.createElement("strong");
    description.textContent = expense.description;

    const value = document.createElement("span");
    value.textContent = currency.format(expense.value);
    copy.append(description, value);

    const removeButton = document.createElement("button");
    removeButton.className = "remove-expense";
    removeButton.type = "button";
    removeButton.dataset.removeExpense = String(expense.id);
    removeButton.setAttribute("aria-label", `Remover ${expense.description}`);
    removeButton.textContent = "×";

    item.append(copy, removeButton);
    return item;
  });

  list.replaceChildren(...items);
}

function updateExpenseSummary() {
  const total = calculateExpensesTotal(expenses);
  const participants = document.querySelector("#participant-count").valueAsNumber;
  const totalOutput = document.querySelector("#expense-total");
  const shareOutput = document.querySelector("#expense-share");

  totalOutput.textContent = currency.format(total);
  if (!Number.isInteger(participants) || participants < 1) {
    shareOutput.textContent = "Informe pessoas";
    return;
  }

  shareOutput.textContent = currency.format(splitExpenses(total, participants));
}

function submitExpense(form) {
  const description = form.elements.namedItem("description").value.trim();
  const value = readNumber(form, "value");

  if (!description) {
    setFeedback(form, "Escreva uma descrição para a despesa.");
    return;
  }

  if (!Number.isFinite(value) || value <= 0) {
    setFeedback(form, "Informe um valor maior que zero.");
    return;
  }

  expenses.push({ id: nextExpenseId, description, value });
  nextExpenseId += 1;
  form.reset();
  setFeedback(form);
  renderExpenseList();
  updateExpenseSummary();
  form.elements.namedItem("description").focus();
}

function handleSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  setFeedback(form);

  switch (form.dataset.tool) {
    case "discount":
      submitDiscount(form);
      break;
    case "installments":
      submitInstallments(form);
      break;
    case "investment":
      submitInvestment(form);
      break;
    case "expense":
      submitExpense(form);
      break;
    default:
      setFeedback(form, "Não foi possível identificar esta ferramenta.");
  }
}

document.querySelectorAll("form[data-tool]").forEach((form) => {
  form.addEventListener("submit", handleSubmit);
});

document.querySelector("#expense-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-expense]");
  if (!button) {
    return;
  }

  const expenseId = Number(button.dataset.removeExpense);
  const index = expenses.findIndex((expense) => expense.id === expenseId);
  if (index === -1) {
    return;
  }

  expenses.splice(index, 1);
  renderExpenseList();
  updateExpenseSummary();
});

document.querySelector("#participant-count").addEventListener("input", updateExpenseSummary);
