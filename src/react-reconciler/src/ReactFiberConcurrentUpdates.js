import { HostRoot } from "./ReactWorkTag";

/**
 * 本来此文件要处理更新优先级的问题，目前先只实现向上找到根节点
 * @param {*} sourceFiber
 */
export function markUpdateLaneFromFiberToRoot(sourceFiber) {
  let node = sourceFiber;
  let parent  = sourceFiber.return

  while(parent !== null) {
     node = parent
     parent = parent.return
  }

  // 一直找到parent为null
  if(node.tag === HostRoot) {
    return node.stateNode
  }
  return null
}
