import {
  HostRoot,
  IndeterminateComponent,
  HostComponent,
  HostText,
} from "./ReactWorkTag";
import { NoFlags } from "./ReactFiberFlags";

/**
 *
 * @param {*} tag fiber的类型，函数组件0 类组件1 原生组件5 根元素5
 * @param {*} 新属性，等待处理或者说生效的属
 * @param {*} 唯一标识
 */

function FiberNode(tag, pendingProps, key) {
  this.tag = tag;
  this.key = key;
  this.type = null; // fiber类型，来自虚拟dom节点的type span div p class Component...
  this.stateNode = null; // 此fiber对应的真实dom节点， h1 => 真实的h1 DOM

  this.return = null;
  this.child = null;
  this.sibling = null;

  // fiber哪来的？通过虚拟dom节点创建，虚拟dom会提供penddingProps用来创建fiber节点的属性
  this.pendingProps = pendingProps; // 等待生效的属性
  this.memoizedProps = null; // 已经生效的属性

  // 每个fiber自己的状态，美中fiber状态存的类型是不一样的
  // 类组件对应的fiber存的就是类的实例的状态，HostRoot存的就是要渲染的元素
  this.memoizedState = null;
  this.updateQueue = null; // 每个fiber身上可能还有更新队列
  this.flags = NoFlags; // 副作用标识，表示要针对fiber节点进行何种操作
  this.subtreeFlags = NoFlags; // 子节点对应的副作用标识，为了性能优化夫节点记住子节点的副作用
  this.alternate = null; // 替身，轮替
  this.index = 0;
}
function createFiber(tag, pendingProps, key) {
  return new FiberNode(tag, pendingProps, key);
}

export function createHostFiberRoot() {
  return createFiber(HostRoot, null, null);
}

/**
 * 基于老的fiber和新的属性创建新的fiber
 * @param {*} current 老的fiber
 * @param {*} pendingProps 新属性
 */
export function createWorkInProgress(current, pendingProps) {
  let workInProgress = current.alternate;

  if (workInProgress === null) {
    workInProgress = createFiber(current.tag, pendingProps, current.key);
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;
    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
    workInProgress.pendingProps = pendingProps;
    workInProgress.type = current.type;
    workInProgress.flags = NoFlags;
    workInProgress.subtreeFlags = NoFlags;
  }

  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue;
  workInProgress.sibling = current.sibling;
  workInProgress.index = current.index;
  return workInProgress;
}

/**
 * 根据虚拟dom创建fiber节点
 * @param {*} element
 */
export function createFiberFromElement(element) {
  const { type, key, props: pendingProps } = element;
  return createFiberFromTypeAndProps(type, key, pendingProps);
}

function createFiberFromTypeAndProps(type, key, pendingProps) {
  let tag = IndeterminateComponent;
  // 如果类型type是一种字符串 span div 说明此fiber类型是一个原生组件
  if (typeof type === "string") {
    tag = HostComponent;
  }

  const fiber = createFiber(tag, pendingProps, key);
  fiber.type = type;
  return fiber;
}

export function createFiberFromText(content) {
  return createFiber(HostText, content, null);
}
