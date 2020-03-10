import { JoinItem } from './JoinItem.js';

export class OperationType {
  constructor(method, modifier, join_on, alias) {
    // join or union
    this.method = method === undefined ? "" : method;
    // modifier join: left, right, outer, inner | union: all
    this.modifier = modifier === undefined ? "" : modifier;
    // array of JoinItem objects
    this.join_on = join_on === undefined ? [] : join_on;
    // unique source alias
    this.alias = alias === undefined ? null : alias;
  }

  newOperationType(method, modifier, join_on) {
    return new OperationType(method, modifier, join_on);
  }

  fromObject(o) {
    return new OperationType(
      Object.keys(o).includes("method") ? o.method : '',
      Object.keys(o).includes("modifier") ? o.modifier : '',
      Object.keys(o).includes("join_on") ? o.join_on.map((v) => { return new JoinItem().fromObject(v) }) : [],
      Object.keys(o).includes("alias") ? o.alias : ''
    )
  }
}

export const newOperationType = OperationType.prototype.newOperationType;
