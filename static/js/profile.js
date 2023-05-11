const profilePage = document.querySelector(".profile")
const profileEditLink = document.querySelectorAll(".profile-edit-link")

profileEditLink.forEach(link => {
  link.addEventListener("click", (e) => {
    profilePage.classList.toggle("edit")
  })
})