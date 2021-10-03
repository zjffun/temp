import { IModel } from './types';

export default function model2graph(model: IModel): IGraph {
  const { nodes, links } = model;
  const nodeMap = new Map();
  nodes.forEach((node) => {
    nodeMap.set(node.id, node);
  });
  const entries = [];
  const outputs = [];
  links.forEach((link) => {
    const fromNode = nodeMap.get(link.from);
    const toNode = nodeMap.get(link.to);
    if (!toNode.sources) {
      toNode.sources = [];
    }
    toNode.sources.push(fromNode);

    if (!fromNode.user) {
      fromNode.user = [];
    }
    fromNode.user.push(toNode);
  });
  nodes.forEach((node) => {
    if (!node.sources.length === 0) {
      entries.push(node);
    }
  });

  nodes.forEach((node) => {
    if (!node.user.length === 0) {
      outputs.push(node);
    }
  });

  return {
    nodes,
    links,
    entries,
    outputs,
  };
}
