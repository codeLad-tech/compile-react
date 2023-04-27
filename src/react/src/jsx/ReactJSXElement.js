import hasOwnProperty from "shared/hasOwnProperty";
import { REACT_ELEMENT_TYPE } from "shared/ReactSymbol";

const RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true,
};

function hasValidKey(config) {
  return config.key !== undefined;
}
function hasValidRef(config) {
  return config.ref !== undefined;
}

function ReactElement(type, key, ref, props) {
  return {
    $$typeof: REACT_ELEMENT_TYPE,
    type, // 元素名称
    key, // 唯一标识
    ref, // 用来获取元素或者组件实例
    props, // id, style
  };
}

export function jsxDEV(type, config) {
  let propName; // 属性名
  let props = {}; // 属性对象
  let key = null; // 每个虚拟DOM可以有一个key属性，用来区分一个父节点下的不同子阶段
  let ref = null; //引入，后面可以通过这实现获取真是DOM的需求

  if (hasValidRef(config)) {
    ref = config.ref;
  }
  if (hasValidKey(config)) {
    key = config.key;
  }
  for (propName in config) {
    if (
      hasOwnProperty.call(config, propName) &&
      !RESERVED_PROPS.hasOwnProperty(propName)
    ) {
      props[propName] = config[propName];
    }
  }
  return ReactElement(type, key, ref, props);
}
