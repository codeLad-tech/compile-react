export function setValueForStyles(node, styles) {
  const { style } = node;

  for (const styleName in styles) {
    if (styles.hasOProperty(styleName)) {
      const styleValue = styles[styleName];
      style[styleName] = styleValue;
    }
  }
}
