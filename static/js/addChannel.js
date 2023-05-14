const body = document.querySelector("body")

// show modal 
const showModalBtn = document.querySelector(".channels__add-btn")
if (showModalBtn) {
  showModalBtn.addEventListener("click", () => {
    body.classList.add("add-channel")
  })
}


// hide modal 
const removeModalBtns = document.querySelectorAll(".channel-not-add")
if (removeModalBtns.length > 0) {
  removeModalBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      body.classList.remove("add-channel")
    })
  })
}

