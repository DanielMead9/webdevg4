function toggleMenu() {
  const menu = document.getElementById("smallMenu");
  const btn = document.querySelector('[aria-controls="smallMenu"]');
  const isShown = menu.classList.contains("w3-show");

  menu.classList.toggle("w3-show");
  menu.setAttribute("aria-hidden", isShown ? "true" : "false");
  btn.setAttribute("aria-expanded", isShown ? "false" : "true");
}
