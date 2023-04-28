import logger from "shared/logger";
import { HostComponent, HostRoot, HostText } from "./ReactWorkTag";
import { processUpdateQueue } from "./ReactFiberClassUpdateQueue";
import { mountChildFibers, reconcileChildFibers } from "./ReactChildFiber";
import { shouldSetTextContent } from "react-dom-bindings/src/ReactDOMHostConfig";
/**
 * 根据新的虚拟dom生成新的fiber链表
 * @param {*} current 老的父fiber
 * @param {*} workInProgress 新的fiber
 * @param {*} nextChildren 新的子虚拟dom
 */
function reconcileChildren(current, workInProgress, nextChildren) {
  // 如果此新的fiber没有老fiebr,说明此新fiber是新创建的
  // 如果此fiber 没能对应的老fiber，说明此fiber是新创建的，如果这个父fiber是新创建的，它的儿子们也肯定是新创建的
  if (current === null) {
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren);
  } else {
    // 如果说没有老fiber的话，做dom-diff 拿老的子fiber链表和新的子虚拟dom比较，进行最小化的更新；
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren
    );
  }
}

function updateHostRoot(current, workInProgress) {
  // 需要知道它的子虚拟dom. 知道它的儿子的虚拟dom信息
  processUpdateQueue(workInProgress);
  const nextState = workInProgress.memoizedState; // workInProgress.memoizedState = { element }
  // nextChildren就是新的子虚拟dom
  const nextChildren = nextState.element;
  // 根据新的虚拟dom生成子fiber链表
  reconcileChildren(current, workInProgress, nextChildren);
  return workInProgress.child;
}

/**
 * 构建原生组件的子fibier链表
 * @param {*} current 老fiber
 * @param {*} workInProgress 新fiber
 * @returns
 */
function updateHostComponent(current, workInProgress) {
  const { type } = workInProgress;
  const nextProps = workInProgress.pendingProps;
  let nextChildren = nextProps.children;
  // 判断当前虚拟dom它的儿子是不是一个文本独生子
  const isDirecTextChild = shouldSetTextContent(type, nextProps);
  if (isDirecTextChild) {
    nextChildren = null;
  }
  reconcileChildren(current, workInProgress, nextChildren);

  return workInProgress.child;
}

/**
 * 目标是根据新虚拟dom构建新的fiber子链表 child sibling
 * @param {*} current 老的fiber
 * @param {*} workInProgress 新的fiber
 * @returns
 */
export function beginWork(current, workInProgress) {
  logger("beginWork", workInProgress);
  switch (workInProgress.tag) {
    case HostRoot:
      return updateHostRoot(current, workInProgress);
    case HostComponent:
      return updateHostComponent(current, workInProgress);
    case HostText:
      return null;
    default:
      return null;
  }
}
