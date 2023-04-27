import { schduleCallback } from "schduler";
import { createWorkInProgress } from "./ReactFiber";
import { beginWork } from "./ReactFiberBeginWork";
import { completeWork } from "./ReactFiberCompleteWork";

let workInProgress = null;
/**
 * 计划更新root
 * 源码中此处有一个任务的功能
 * @param {*} root
 */
export function scheduleUpdateOnFiber(root) {
  ensureRootIsScheduled(root); // 确保调度执行root上的更新
  // schduleCallback()
}

function ensureRootIsScheduled(root) {
  // 告诉浏览器要执行performConcurrentWorkOnRoot
  schduleCallback(performConcurrentWorkOnRoot.bind(null, root));
}

/**
 * 根据虚拟dom构建fiber树和创建真实的dom节点，最后插入容器
 * @param {*} root
 */
function performConcurrentWorkOnRoot(root) {
  //初次渲染的时候 以同步的方式渲染根节点
  renderRootSync(root);
}

function prepareFreshStack(root) {
  workInProgress = createWorkInProgress(root.current, null);
}

function renderRootSync(root) {
  // 开始构建fiber树
  prepareFreshStack(root);
  workLoopSync();
}

function workLoopSync() {
  while (workInProgress !== null) {
    performUniOfWork(workInProgress);
  }
}

/**
 * 执行一个工作单元
 * @param {*} uniOfWork
 */
function performUniOfWork(uniOfWork) {
  // 获取新的fiber对云高的老fiber
  const current = uniOfWork.alternate;
  // 完成当前fiber的子fiber链表构建
  const next = beginWork(current, uniOfWork);
  uniOfWork.memoizedProps = uniOfWork.pendingProps;

  if (next === null) {
    // 没有子节点，已经完成了
    completeUnitOfWork(uniOfWork);
  } else {
    // 如果有子节点，就让子节点成为下一个工作单元
    workInProgress = next;
  }
}

function completeUnitOfWork(uniOfWork) {
  let completedWork = uniOfWork;
  do {
    const current = completedWork.alternate;
    const returnFiber = completedWork.return;
    // 执行此fiber的完成工作，如果是原生组件的话就是创建真实dom
    completeWork(current, completedWork);
    // 如果有弟弟，就构建弟弟对应的fiber链表
    const siblingFiber = completedWork.sibling;
    if (siblingFiber !== null) {
      workInProgress = siblingFiber;
      return;
    }
    // 如果没有弟弟，说明这当前完成的就是父fiber的最后一个节点
    completedWork = returnFiber;
    workInProgress = completedWork;
  } while (completedWork !== null);
}
