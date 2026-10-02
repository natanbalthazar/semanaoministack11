// Criado uma vez só: montar um Intl.NumberFormat a cada item da lista é caro à toa.
// O Hermes (engine JS do React Native) já suporta Intl, então não precisa de polyfill.
const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

/** Formata um número como moeda brasileira. Ex.: 1200.5 → "R$ 1.200,50". */
export default function formatCurrency(value) {
  return currencyFormatter.format(value);
}
