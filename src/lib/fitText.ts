export function fitTextToBox(
  el: HTMLElement,
  minPx: number = 8,
  step: number = 1,
) {
  const style = window.getComputedStyle(el);
  let size = parseFloat(style.fontSize) || 14;

  while (el.scrollHeight > el.clientHeight && size > minPx) {
    size -= step;
    el.style.fontSize = size + "px";
    el.style.lineHeight = "1.05";
  }

  if (!el.classList.contains("guess-image")) {
    if (!el.title) el.title = el.textContent?.trim() || "";
  } else {
    el.removeAttribute("title");
  }
}
