#### 为什么 18 以前的老版本中每个组件中都需要引入 React

答：因为在老版本中，jsx 最终会被 babel 编译成 React.createElment 的形式，为了防止找不到 React，需要手动引入，现在的版本不需要手动引入是因为官方在源码中增加了一个 jsx runtime 的包来对 jsx 进行一层浅转换
