// 🔵 DEMO — "getByRole" do Maestro: seletores por papel, num lugar só.
// `output` é global do Maestro (não é Node). id/text no Maestro são REGEX.
// Pra descobrir os ids reais: `maestro hierarchy` na tela.
output.role = {
  // ~ getAllByRole('button', { name: /heart/ })
  botaoCoracao: "movie-card-heart-.*",
  // ~ getByRole('button', { name: /favoritos/i })
  botaoFavoritos: "movielist-favorites-button",
  // ~ getAllByRole('listitem') na tela de favoritos
  itemFavorito: "favorites-item-.*",
};
