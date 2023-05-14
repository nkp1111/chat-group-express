const sidebar = document.querySelector(".app__sidebar")
const backBtn = document.querySelector(".channels__back-btn")

if (backBtn) {
  backBtn.addEventListener("click", (e) => {
    sidebar.classList.add("all-channels")
  })
}

