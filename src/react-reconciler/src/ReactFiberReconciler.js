import { createFiberRoot } from "./ReactFiberRoot"
import { createUpdate, enqueueUpdate } from "./ReactFiberClassUpdateQueue"
import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop"

export function createContainer(containerInfo) {
  return createFiberRoot(containerInfo);
}

/**
 * 把虚拟dom element 变成真实dom插入到container容器中
 * @param {*} element 虚拟dom
 * @param {*} container dom容器，FiberRootNode containerInfo div#root
 */
export function updateContainer(element, container) {
  const current = container.current // 获取当前根fiber
  const update = createUpdate() // 创建更新
  update.payload = { element }  // 要更新的虚拟dom
  const root = enqueueUpdate(current, update)  // 把此更新对象添加到current这个根Fiber的更新队列上，然后返回根节点
  scheduleUpdateOnFiber(root)
}
