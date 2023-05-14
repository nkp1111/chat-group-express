const socket = io()

const activeUserShow = document.querySelector(".active-user-count")
socket.on("count", (num) => {
  activeUserShow.innerText = num
})