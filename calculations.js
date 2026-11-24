const MAX_INVESTMENT_MONTHS = 1200;

export function calculateDiscount(price, percentage) {
  if (!Number.isFinite(price) || price <= 0) {
    throw new RangeError("Informe um preço maior que zero.");
  }

  if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) {
    throw new RangeError("O desconto deve estar entre 0% e 100%.");
  }

  const savings = (price * percentage) / 100;
  return {
    originalPrice: price,
    percentage,
    savings,
    finalPrice: price - savings,
  };
}

export function calculateInstallment(total, count) {
  if (!Number.isFinite(total) || total <= 0) {
    throw new RangeError("Informe um valor total maior que zero.");
  }

  if (!Number.isInteger(count) || count < 1) {
    throw new RangeError("A quantidade de parcelas deve ser um número inteiro maior que zero.");
  }

  return total / count;
}

export function simulateInvestment(initial, monthlyDeposit, monthlyRate, months) {
  if (!Number.isFinite(initial) || initial < 0) {
    throw new RangeError("O valor inicial não pode ser negativo.");
  }

  if (!Number.isFinite(monthlyDeposit) || monthlyDeposit < 0) {
    throw new RangeError("O aporte mensal não pode ser negativo.");
  }

  if (initial === 0 && monthlyDeposit === 0) {
    throw new RangeError("Informe um valor inicial ou um aporte mensal.");
  }

  if (!Number.isFinite(monthlyRate) || monthlyRate < 0) {
    throw new RangeError("A taxa mensal não pode ser negativa.");
  }

  if (!Number.isInteger(months) || months < 1 || months > MAX_INVESTMENT_MONTHS) {
    throw new RangeError("O período deve ser um número inteiro entre 1 e 1.200 meses.");
  }

  const rate = monthlyRate / 100;
  let balance = initial;

  for (let month = 0; month < months; month += 1) {
    balance *= 1 + rate;
    balance += monthlyDeposit;
  }

  const invested = initial + monthlyDeposit * months;
  return {
    finalBalance: balance,
    invested,
    earnings: balance - invested,
  };
}

export function calculateExpensesTotal(expenses) {
  if (!Array.isArray(expenses)) {
    throw new TypeError("As despesas devem ser informadas em uma lista.");
  }

  if (expenses.length === 0) {
    return 0;
  }

  let total = 0;
  let index = 0;

  do {
    const value = expenses[index].value;
    if (!Number.isFinite(value) || value <= 0) {
      throw new RangeError("Cada despesa deve ter um valor maior que zero.");
    }

    total += value;
    index += 1;
  } while (index < expenses.length);

  return total;
}

export function splitExpenses(total, participants) {
  if (!Number.isFinite(total) || total < 0) {
    throw new RangeError("O total das despesas não pode ser negativo.");
  }

  if (!Number.isInteger(participants) || participants < 1) {
    throw new RangeError("Informe uma quantidade inteira de pessoas maior que zero.");
  }

  return total / participants;
}
