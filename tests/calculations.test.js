import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateDiscount,
  calculateExpensesTotal,
  calculateInstallment,
  simulateInvestment,
  splitExpenses,
} from "../calculations.js";

test("calcula economia e preço final para desconto de 20%", () => {
  assert.deepEqual(calculateDiscount(250, 20), {
    originalPrice: 250,
    percentage: 20,
    savings: 50,
    finalPrice: 200,
  });
});

test("aceita desconto integral e rejeita percentual acima de 100%", () => {
  assert.equal(calculateDiscount(80, 100).finalPrice, 0);
  assert.throws(() => calculateDiscount(80, 100.01), RangeError);
});

test("divide uma compra igualmente sem juros", () => {
  assert.equal(calculateInstallment(120, 3), 40);
  assert.throws(() => calculateInstallment(120, 0), RangeError);
  assert.throws(() => calculateInstallment(120, 1.5), RangeError);
});

test("aplica o rendimento antes do aporte feito ao fim de cada mês", () => {
  const result = simulateInvestment(100, 50, 10, 2);

  assert.ok(Math.abs(result.finalBalance - 226) < 1e-10);
  assert.equal(result.invested, 200);
  assert.ok(Math.abs(result.earnings - 26) < 1e-10);
});

test("soma despesas em objetos e divide igualmente entre os participantes", () => {
  const expenses = [
    { description: "Mercado", value: 25.5 },
    { description: "Jantar", value: 10 },
  ];

  assert.equal(calculateExpensesTotal(expenses), 35.5);
  assert.equal(calculateExpensesTotal([]), 0);
  assert.equal(splitExpenses(35.5, 2), 17.75);
});

test("rejeita lista e quantidade de participantes inválidas", () => {
  assert.throws(() => calculateExpensesTotal(null), TypeError);
  assert.throws(() => calculateExpensesTotal([{ value: 0 }]), RangeError);
  assert.throws(() => splitExpenses(50, 0), RangeError);
});
