# Central de Utilidades

Página web para cálculos do dia a dia, criada com HTML, CSS e JavaScript puro. Os dados ficam somente na memória do navegador e não são enviados para um servidor.

## Ferramentas

- **Descontos:** preço original, percentual, economia e preço final.
- **Parcelas:** divisão do total em parcelas iguais, sem juros.
- **Investimentos:** saldo estimado, aportes e rendimento mensal composto. O aporte é somado ao final de cada mês, depois do rendimento.
- **Despesas:** lista de despesas em array de objetos, total e divisão por participante; permite adicionar e remover itens.

### Esboço da interface

```text
+----------------------------+  +----------------------------+
| Calculadora de descontos   |  | Calculadora de parcelas   |
| preço + percentual         |  | total + número de parcelas|
| [ calcular ]               |  | [ calcular ]              |
| economia + preço final     |  | valor de cada parcela     |
+----------------------------+  +----------------------------+

+----------------------------+  +----------------------------+
| Simulador de investimentos|  | Divisor de despesas       |
| inicial + aporte + taxa    |  | descrição + valor         |
| período + simulação        |  | lista + participantes     |
| saldo + investido + ganho  |  | total + valor por pessoa  |
+----------------------------+  +----------------------------+
```

## Executar localmente

Sirva a pasta por HTTP (necessário para carregar o módulo JavaScript):

```powershell
python -m http.server 8000
```

Abra `http://localhost:8000` no navegador.

## Testes

Os testes usam o executor nativo do Node.js, sem bibliotecas externas:

```powershell
npm test
```
