// Helper dos scaffolds: enquanto existir uma linha  falta('...')  o teste FICA VERMELHO.
// Vermelho = "ainda não feito". Quando você escrever o teste de verdade, APAGUE a linha.
export function falta(desafio: string): never {
  throw new Error(`⬜ ${desafio}: ainda não feito — apague a linha falta(...) quando escrever o teste`);
}
