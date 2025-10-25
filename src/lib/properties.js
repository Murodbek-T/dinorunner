export function getCustomProperty(elem, prop) {
  return parseFloat(getComputedStyle(elem).getPropertyValue(prop)) || 0;
}

export function setCustomProperty(elem, prop, value) {
  if (value === null) return;
  elem.style.setProperty(prop, value.toString());
}

export function incrementCustomProperty(elem, prop, inc) {
  setCustomProperty(elem, prop, getCustomProperty(elem, prop) + inc);
}
