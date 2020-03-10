import { FieldTransform, newFieldTransform } from './FieldTransform.js';

export class JoinItem {
  constructor(entity, operator) {
    // the entity describes how to join tables
    // should be a FieldTransform object
    this.entity = entity === undefined ? new FieldTransform() : entity;
    // if not first join, then 'and' or 'or'
    this.operator = operator === undefined ? "" : operator;
  }

  fromObject(o) {
    return new JoinItem(
      Object.keys(o).includes("entity") ?  new FieldTransform().fromObject(o.entity) : {},
      Object.keys(o).includes("operator") ?  o.operator : ""
    )
  }
}
