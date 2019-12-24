function renderScreen (state, screen, playerId) {
  const context = screen.getContext('2d')
  context.fillStyle = 'white'
  context.clearRect(0, 0, 10, 10)
  for (const playerId in state.players) {
    const player = state.players[playerId]
    context.fillStyle = 'black'
    context.fillRect(player.x, player.y, 1, 1)
  }
  for (const fruitId in state.fruits) {
    const fruit = state.fruits[fruitId]
    context.fillStyle = 'green'
    context.fillRect(fruit.x, fruit.y, 1, 1)
  }

  const currentPlayer = state.players[playerId]
  if (currentPlayer) {
    context.fillStyle = '#FDD835'
    context.fillRect(currentPlayer.x, currentPlayer.y, 1, 1)
  }

  requestAnimationFrame(() => {
    renderScreen(state, screen, playerId)
  })
}

export default renderScreen
