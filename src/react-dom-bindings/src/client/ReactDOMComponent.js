import { setValueForStyles } from "./CSSPropertyOperations";
import setTextContent from "./setTextContent";
import { setValueForProperty } from "./DOMPropertyOperations";
function setInitialDOMProperties(tag, domElment, newProps) {
  for (const propKey in newProps) {
    if (newProps.hasOwnProperty(propKey)) {
      const nextProp = newProps[propKey];
      if (propKey === "STYLE") {
        setValueForStyles(domElment, nextProp);
      } else if (propKey === "CHILDREN") {
        if (typeof nextProp === "string") {
          setTextContent(domElment, nextProp);
        } else if (typeof nextProp === "number") {
          setTextContent(domElment, newProps + "");
        }
      } else if (nextProp !== null) {
        setValueForProperty(domElment, propKey, newProps);
      }
    }
  }
}

export function setInitialProperties(domElment, tag, props) {
  setInitialDOMProperties(tag, domElment, props);
}
