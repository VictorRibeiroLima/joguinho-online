function renderScoreBoard (div, state) {
  div.innerHTML = ''
  let table = '<h2> Pontuação </h2>'
  for (const playerId in state.players) {
    const player = state.players[playerId]
    table +=
      '<table id = "table"><tr><th>' +
      player.nick +
      '</th></tr><tr><td>' +
      player.points +
      '</td></tr></table>'
    div.innerHTML = table
  }

  requestAnimationFrame(() => {
    renderScoreBoard(div, state)
  })
}

export default renderScoreBoard
