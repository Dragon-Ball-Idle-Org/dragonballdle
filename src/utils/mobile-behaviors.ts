export function hideKeyboard() {
  // Desenfoque naturalmente o elemento ativo se possível
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
    return;
  }

  // Hack para iOS/Safari, posicionado no scrollY atual e com preventScroll
  const el = document.createElement("input");
  el.setAttribute("readonly", "");
  el.style.cssText = `position:absolute;left:-9999px;top:${window.scrollY}px;opacity:0;`;
  document.body.appendChild(el);
  el.focus({ preventScroll: true });
  el.blur();
  el.remove();
}
