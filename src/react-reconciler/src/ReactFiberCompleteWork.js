import logger, { indent } from "shared/logger";
import { HostComponent, HostRoot, HostText } from "./ReactWorkTag";
import {
  createTextInstance,
  createInstance,
  appendInitialChild,
  finalizeIntialChildren,
} from "react-dom-bindings/src/client/ReactDOMHostConfig";
import { NoFlags } from "./ReactFiberFlags";

/**
 * 把当前的完成的fiber所有的子节点对应的真实dom都挂载到自己父parent真实dom节点上
 * @param {*} parent
 * @param {*} workInProgress
 */
function appendAllChildren(parent, workInProgress) {
  let node = workInProgress.child;
  while (node) {
    // appendInitialChild(parent, node.stateNode);
    // node = node.sibling;

    // 如果子节点类型是一个原生节点或者是一个文本节点
    if (node.tag === HostComponent || node.tag === HostText) {
      appendInitialChild(parent, node.stateNode);
    } else if (node.child !== null) {
      // 如果第一个儿子不是原生节点，说明它可能是一个函数组件
      node = node.child;
      continue;
    }

    if (node === workInProgress) {
      return;
    }

    // 如果当前的节点没有弟弟
    while (node.sibling === null) {
      if (node.return === null || node.return === workInProgress) {
        return;
      }
      // node = node.return;
    }
    node = node.sibling;
  }
}

/**
 * 完成一个fiber节点
 * @param {*} workInProgress 新的构建fiber
 */
export function completeWork(current, workInProgress) {
  indent.number -= 2;
  logger(" ".repeat(indent.number) + "completeWork", workInProgress);

  const newProps = workInProgress.pendingProps;
  switch (workInProgress.tag) {
    case HostRoot:
      bubbleProperties(workInProgress);
      break;
    case HostComponent:
      // 如果完成的是原生节点的话，创建真实dom节点
      // 现在只是在处理创建或者说挂载新节点的逻辑，后面此处会进行区分是初次挂载还是更新
      const { type } = workInProgress;
      const instance = createInstance(type, newProps, workInProgress);
      // 把自己所有的儿子添加到自己的身上
      // finalizeIntialChildren(instance, type, newProps);
      appendAllChildren(instance, workInProgress);
      workInProgress.stateNode = instance;
      finalizeIntialChildren(instance, type, newProps);
      bubbleProperties(workInProgress);
      break;
    case HostText:
      // 如果完成的fibier是文本节点，那就创建真实的文本节点
      const newText = newProps;
      // 创建真实的dom节点并传入stateNode
      workInProgress.stateNode = createTextInstance(newText);
      bubbleProperties(workInProgress);
      break;
    default:
      break;
  }
}

function bubbleProperties(completeWork) {
  let subtreeFlags = NoFlags;
  let child = completeWork.child;

  while (child !== null) {
    subtreeFlags |= child.subtreeFlags;
    subtreeFlags |= child.flags;
    child = child.sibling;
  }
  completeWork.subtreeFlags = subtreeFlags;
}
