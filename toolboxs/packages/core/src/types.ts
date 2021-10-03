export type INodeValue = any;

export interface ILink {
  from: string;
  to: string;
  fromWhere: string;
  toWhere: string;
}

export interface INode {
  id: string;
  command: INodeValue;
  type: INodeValue;
  args: INodeValue[];
  cwd: INodeValue;
  env: INodeValue[];
}

export interface IModel {
  nodes: INode[];
  links: ILink[];
}

export enum TaskValueType {
  string,
  stream,
}
type GetTaskValueType<eventName> = eventName extends TaskValueType.string
  ? string
  : eventName extends TaskValueType.stream
  ? number
  : unknown;

export interface ITaskValue {
  type: TaskValueType;
  value: GetTaskValueType<TaskValueType>;
}

export interface ITaskConfig {
  command: ITaskValue;
  args: ITaskValue[];
  cwd: ITaskValue;
  env: ITaskValue[];
}

export interface ITaskNode {
  id: number;
}
