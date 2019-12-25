const nick = document.getElementById('nick')
const buttom = document.getElementById('submit')

buttom.addEventListener('click',()=>{
    localStorage.setItem('nick', nick.value)
    window.location.href= '../game.html'
})
