export class JoinItem {
  constructor(entity, operator) {
    // the entity describes how to join tables
    // should be a FieldTransform object
    this.entity = entity === undefined ? newFieldTransform() : entity;
    // if not first join, then 'and' or 'or'
    this.operator = operator === undefined ? "" : operator;
  }

  newJoinItem() {
    return new JoinItem();
  }
}
