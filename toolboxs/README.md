# 可视化配置

可视化 -> 配置 -> 代码 -> 运行

tool 要素：

- cwd
- env
- command
- args
- input
- (output)
- (exit code)

配置：

有向无环图（node，link）

问题：

1. 为模型中的工具配置数据，从模型中的工具取数据
2. 流程不止有 pipe 和并行，还有顺序，条件（&& 和 ||），循环
3. 模型的要素
