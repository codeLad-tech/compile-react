import { createFiberFromElement } from "./ReactFiber";
import { REACT_ELEMENT_TYPE } from "shared/ReactSymbol";
import { Placement } from "./ReactFiberFlags";
import { createFiberFromText } from "./ReactFiber";
import isArray from "shared/isArray";

/**
 *
 * @param {*} shouldTrackSideEffects 是否跟踪副作用
 */
function createChildReconciler(shouldTrackSideEffects) {
  function reconcileSingleElement(returnFiber, currentFirstFiber, element) {
    // 因为我们现实的是初次挂载，老节点currentFirstFiber肯定是没有的，所以可以直接根据虚拟dom创建新的fiber节点
    const created = createFiberFromElement(element);
    created.return = returnFiber;
    return created;
  }

  function placeSingleChild(newFiber) {
    // 说明要添加副作用
    if (shouldTrackSideEffects) {
      // 在最后的提交节点插入此节点，react渲染分成渲染（创建fiber）和提交（更新dom）两个阶段
      newFiber.flags != Placement;
    }
    return newFiber;
  }

  /**
   *
   * @param {*} returnFiber
   * @param {*} newChild
   */
  function createChild(returnFiber, newChild) {
    if (
      (typeof newChild === "string" && newChild !== "") ||
      typeof newChild === "number"
    ) {
      const created = createFiberFromText(`${newChild}`);
      created.return = returnFiber;
      return created;
    }
    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          const created = createFiberFromElement(`${newChild}`);
          created.return = returnFiber;
          return created;
        }
        default:
          break;
      }
    }
    return null;
  }

  function placeChild(newFiber, newIdx) {
    newFiber.index = newIdx;
    if (shouldTrackSideEffects) {
      // 如果有一个fiber他的flags上有Placement，说明此节点需要创建真实dom节点并且插入到父容器中
      // 如果父fiber节点是初次挂载，shouldTrackSideEffects=false,不需要添加flags
      // 这种情况下会在完成阶段把所有子节点全部添加到自己身上
      newFiber.flags |= Placement;
    }
  }

  /**
   *
   * @param {*} returnFiber
   * @param {*} currentFirstFiber
   * @param {*} newChild
   */
  function reconcileChildrenArray(returnFiber, currentFirstFiber, newChild) {
    let resultingFirstChild = null; // 返回的第一个新儿子
    let previousNerFiber = null; // 上一个的一个新的fiber
    let newIndex = 0;
    for (; newIndex < newChild.length; newIndex++) {
      const newFiber = createChild(returnFiber, newChild[newIndex]);
      if (newFiber === null) continue;
      placeChild(newFiber, newIndex);

      // 如果previousNerFiber为null 说明这是第一个fiber
      if (previousNerFiber === null) {
        resultingFirstChild = newFiber; // 这个newFiber就是大儿子
      } else {
        // 否则说明不是大儿子，就把这个newFiber添加到sibling上
        previousNerFiber.sibling = newFiber;
      }
      previousNerFiber = newChild;
    }
  }

  /**
   * 比较子fiber
   * @param {*} returnFiber 新的父Fiber DOM-DIFF 就是老的子fiber链表和新的虚拟dom进行比较的过程
   * @param {*} currentFirstFiber 老fiber的第一个字fiber
   * @param {*} newChild 新的子虚拟dom
   */
  return function reconcileChildFibers(
    returnFiber,
    currentFirstFiber,
    newChild
  ) {
    // 现在暂时只考虑新的节点只有一个新的情况
    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(returnFiber, currentFirstFiber, newChild)
          );
        default:
          break;
      }
    }

    // nextChild [hello 文本节点， span虚拟dom元素]
    debugger;
    if (isArray(newChild)) {
      return reconcileChildrenArray(returnFiber, currentFirstFiber, newChild);
    }
  };
}

// 有老fiber，更新的时候用
export const reconcileChildFibers = createChildReconciler(true);
// 初次渲染的时候用
export const mountChildFibers = createChildReconciler(false);
