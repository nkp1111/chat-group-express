const sidebar = document.querySelector(".app__sidebar")
const sidebarChannelControl = document.querySelector(".sidebar__channels-add")
const backBtn = document.querySelector(".channels__back-btn")

if (backBtn) {
  backBtn.addEventListener("click", (e) => {
    sidebarChannelControl.innerHTML = `
      <strong>Channels</strong>
      <button class='btn channels__add-btn'>
        <i class="fa-solid fa-plus"></i>
      </button>
    `
    sidebar.classList.add("all-channels")
  })
}

sidebarChannelControl.add