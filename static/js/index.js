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


// add new message to channel
const messageForm = document.querySelector(".channel-message-form")
const usernameHolder = document.querySelector(".current-user-name")
const channelHolder = document.querySelector(".channel-name span")
let username = "None"
let channel = "None"
if (messageForm) {
  messageForm.addEventListener("submit", (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (usernameHolder) {
      username = usernameHolder.innerText.trim()
    }
    if (channelHolder) {
      channel = channelHolder.innerText.trim()
    }
    const message = e.currentTarget.children[0].value
    e.currentTarget.children[0].value = ""
    socket.emit("newMessage", { message, username, channel })
  })
}

// on channel update
socket.on("channelUpdated", (channel) => {
  if (channelHolder) {
    let channelName = channelHolder.innerText.trim()

    if (channelName === channel) {
      window.location.reload()
    }
  }
})