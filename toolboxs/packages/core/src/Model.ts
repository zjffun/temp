import { Tool } from './Tool';
import statistic from './tools/git-statisitc.js';
import eachline from './tools/eachline.ts';

export class Model {
  public process;
  public stdin;

  constructor(model) {
    const { nodes, links } = model;
    const nodeMap = new Map();
    nodes.forEach((node) => {
      if (node.type === 'tool') {
        node.tool = new Tool(node);
      }
      if (node.type === 'model') {
        new Model(statistic);
      }
      nodeMap.set(node.id, node);
    });
    const entries = [];
    const outputs = [];

    links.forEach((link) => {
      const fromNode = nodeMap.get(link.from[0]);
      const toNode = nodeMap.get(link.to[0]);

      if (link.from[1] === 'stdout') {
        if (link.to[1] === 'stdin') {
          if (toNode.type === 'buildin') {
            eachline(fromNode.tool.process.stdout);
          } else {
            fromNode.tool.process.stdou.pipe(toNode.tool.process.stdin);
          }
        }
      }

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
  }
}
