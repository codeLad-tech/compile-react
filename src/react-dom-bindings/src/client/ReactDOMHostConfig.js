import { setInitialProperties } from "./ReactDOMComponent";

export function shouldSetTextContent(type, props) {
  return (
    typeof props.children === "string" || typeof props.children === "number"
  );
}

export function createTextInstance(content) {
  return document.createTextNode(content);
}

export function createInstance(type, props, workInProgress) {
  const domElment = document.createElement(type);
  return domElment;
}

export function appendInitialChild(parent, child) {
  parent.appendChild(child);
}

export function finalizeIntialChildren(domElment, type, props) {
  setInitialProperties(domElment, type, props);
}
