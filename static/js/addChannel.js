const body = document.querySelector("body")

// show modal 
const showModalBtn = document.querySelector(".channels__add-btn")
if (showModalBtn) {
  showModalBtn.addEventListener("click", () => {
    body.classList.add("add-channel")
  })
}


// hide modal 
const removeModalBtn = document.querySelector(".channel-not-add")
if (removeModalBtn) {
  removeModalBtn.addEventListener("click", (e) => {
    body.classList.remove("add-channel")
  })
}