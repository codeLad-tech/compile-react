import {markUpdateLaneFromFiberToRoot} from './ReactFiberConcurrentUpdates';
import assign from "shared/assign"

export const UpdateState = 0

export function initialUpdateQueue(fiber) {
  // 创建更新队列；padding是一个循环链表
  const queue = {
    shared: {
      pending: null,
    },
  };
  fiber.updateQueue = queue;
}

export function createUpdate() {
  const update = { tag: UpdateState };
  return update;
}

export function enqueueUpdate(fiber, update) {
  let updateQueue = fiber.updateQueue;
  let pending = updateQueue.shared.pending;

  if (pending === null) {
    update.next = update
  } else {
    update.next = pending.next;
    pending.next = update;
  }

  // pending指向最后一个更新，最后一个更新 next 指向第一个更新， 单向循环链表
  updateQueue.shared.pending = update;

  return markUpdateLaneFromFiberToRoot(fiber);
}

/**
 * 根据老的状态和更新队列中的更新计算最新的状态
 * @param {*} workInProgress
 */
export function processUpdateQueue(workInProgress) {
  const queue = workInProgress.updateQueue
  const pendingQueue = queue.shared.pending

  // 如果有更新，或者说更新队列有内容
  if(pendingQueue !== null) {
    // 清除等待有效的更新
    queue.shared.pending = null
    // 获取更新队列中最后一个更新 update = {payload: {element: "h1"}}
    const lastPendingUpdate = pendingQueue
    // 指向第一个更新
    const firstPendingUpdate = lastPendingUpdate.next
    // 把更新链表解开，变成一个单链表
    lastPendingUpdate.next = null
    let newState = workInProgress.memoizedState
    let update = firstPendingUpdate

    while(update) {
      // 根据老的状态和更新计算新的状态
      newState = getStateFromUpdate(update, newState)
      update = update.next
    }
    // console.log("newState--->", newState)
    // 把最终的计算到的状态复制给memoizedState
    workInProgress.memoizedState = newState
  }
}

/**
 * state=0 update=>1 update=2
 * @param {*} update 更新的对象其实有很多种类型
 * @param {*} prevState
 */
function getStateFromUpdate(update, prevState = {}) {
  switch(update.tag) {
    case UpdateState:
      const { payload } = update
      return assign({}, prevState, payload)
  }
}
