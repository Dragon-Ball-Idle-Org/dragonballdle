export function hideKeyboard() {
  const el = document.createElement('input');
  el.setAttribute('readonly', '');
  el.style.cssText = 'position:absolute;left:-9999px';
  document.body.appendChild(el);
  el.focus();
  el.blur();
  el.remove();
};