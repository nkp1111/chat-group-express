const socket = io()

// show current active user count
const activeUserShow = document.querySelector(".active-user-count")
socket.on("count", (num) => {
  activeUserShow.innerText = num
})

// add new channel
// const addChannelForm = document.querySelector(".add-channel-form")
// addChannelForm.addEventListener("submit", (e) => {
//   socket.emit("channelAdded")
// })

