const sidebar = document.querySelector(".app__sidebar")
const backBtn = document.querySelector(".channels__back-btn")

if (backBtn) {
  backBtn.addEventListener("click", (e) => {
    sidebar.classList.add("all-channels")
  })
}

// hamburger show sidebar and hide on small screen 
const hamburgerMenu = document.querySelector(".hamburger-menu")
const closeBtn = document.querySelector(".app__sidebar .position-absolute")
if (hamburgerMenu) {
  hamburgerMenu.addEventListener("click", (e) => {
    sidebar.style.display = "flex"
    closeBtn.style.display = "block"
  })
}

if (closeBtn) {
  closeBtn.addEventListener("click", (e) => {
    sidebar.style.display = "none"
    closeBtn.style.display = "none"
  })
}

document.addEventListener("resize", (e) => {
  if (window.innerWidth > 799) {
    closeBtn.style.display = "none"
  }
})
