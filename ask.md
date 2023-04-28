# 18 版本为什么不需要在增加 import React from "react" 了？

答 实际上不在手动引入 React 模块是从 17 版本就已经实现了，而为什么不在需要手动引入是因为之前 jsx 是被编译成 React.CreateElment 的，所以需要手动引入 React 防止找不到，17 版本之后不需要手动添加 React 是因为实现了一个 jsx-runrime 的功能代替了 React.CreateElment 创建虚拟节点，不过 jsx-runrime 和 React.CreateElment 的功能是一样的，如果要在老版本的 React 中也想不在手动添加 React，需要设置预编译@babel/preset-react 配置{"runtime": "classic"}
