const head = document.getElementById("header");
head.classList.add('fade');
const remover = () => head.classList.remove('fade');
document.addEventListener("DOMContentLoaded", remover);