import  { createHostFiberRoot } from "./ReactFiber"
import { initialUpdateQueue } from "./ReactFiberClassUpdateQueue"
function FiberRootNode(containerInfo) {
  this.containerInfo = containerInfo
}

export function createFiberRoot(containerInfo) {
  const root = new FiberRootNode(containerInfo);
  // HostRoot指向的是根节点#root
  const uninitializedFiber = createHostFiberRoot()
  // current 指向当前的根fiber
  root.current = uninitializedFiber
  // stateNode指向真实的dom节点
  uninitializedFiber.stateNode = root
  initialUpdateQueue(uninitializedFiber)
  return root
}
