// change login to sign In form and vice versa
const form = document.querySelector("form")
const formHeading = document.querySelector("legend")
const control = document.querySelector(".control-text")
if (control) {
  const link = control.querySelector(".link")
  const text = control.querySelector("span")
  link.addEventListener("click", (e) => {
    if (e.currentTarget.innerText === "register") {
      e.currentTarget.innerText = "login"
      text.innerText = "Already registered?"
      form.setAttribute("action", "/user/signin")
      formHeading.innerText = "Sign Up"
    } else {
      e.currentTarget.innerText = "register"
      text.innerText = "Are you new user?"
      form.setAttribute("action", "/user/login")
      formHeading.innerText = "Log In"
    }
  })
}