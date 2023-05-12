document.querySelector(".needs-validation").addEventListener("submit", (e) => {
  // check edited information and send to database
  e.preventDefault()
  e.stopPropagation()
  const form = e.currentTarget

  if (!form.checkValidity()) {
    form.classList.add("was-validated")
  }
  else {
    const editedProfileInfo = {}

    // image field 
    const img = form.querySelector("input[type='file']").files[0]
    const reader = new FileReader()
    reader.readAsDataURL(img)
    reader.addEventListener("loadend", function (e) {
      const image = this.result
      editedProfileInfo["image"] = image

      // inputs field 
      const inputs = form.querySelectorAll("input")
      inputs?.forEach((input, ind) => {
        if (ind > 0) {
          editedProfileInfo[input.id] = input.value
        }
      })
      // bio field 
      const textarea = form.querySelector("textarea")
      editedProfileInfo["bio"] = textarea.value

      fetch("/profile/edit", {
        method: "POST",
        body: JSON.stringify(editedProfileInfo),
        headers: {
          "Content-Type": "application/json"
        },
      })
        .then(() => {
          document.querySelector(".profile").classList.remove("edit")
          window.location.reload()
        })
        .catch(err => {
          document.querySelector(".profile").classList.remove("edit")
          window.location.reload()
        })
    })
  }
})
