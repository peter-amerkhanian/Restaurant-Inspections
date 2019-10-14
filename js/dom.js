/** The following fades in the header */
const head = document.getElementById("header");
head.classList.add("fade");
const remover = () => head.classList.remove("fade");
document.addEventListener("DOMContentLoaded", remover);

/** The following code activates the modal */
const btn = document.getElementById("modal");
const modal = document.getElementById("myModal");
function modalReveal() {
  modal.style.display = "block";
}
btn.onclick = modalReveal;
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

const cancel = document.getElementsByClassName("close")[0];
function modalClose() {
    modal.style.display = "none";
}
cancel.onclick = modalClose;
