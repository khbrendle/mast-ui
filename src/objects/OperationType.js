export class OperationType {
  constructor(method, modifier, join_on) {
    // join or union
    this.method = method === undefined ? "" : method;
    // modifier join: left, right, outer, inner | union: all
    this.schema = schema === undefined ? "" : schema;
    // array of JoinItem objects
    this.join_on = join_on === undefined ? [] : join_on;
    // unique source alias
    this.alias = alias === undefined ? null : alias;
  }

  newOperationType(method, modifier, join_on) {
    return new OperationType(method, modifier, join_on);
  }
}

export const newOperationType = OperationType.prototype.newOperationType;
