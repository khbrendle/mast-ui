// import { FieldTransform, newFieldTransform } from './FieldTransform.js';
//
// export class Equality {
//   constructor(operator, arg) {
//     // the entity describes how to join tables
//     // >, <, ==, etc.
//     this.operator = operator === undefined ? "" : operator;
//     // FieldTransform object
//     this.arg = arg === undefined ? new FieldTransform() : arg;
//   }
//
//   fromObject(o) {
//     return new Equality(
//       Object.keys(o).includes("operator") ?  o.operator : "",
//       Object.keys(o).includes("arg") ?  new FieldTransform().fromObject(o.arg) : {}
//     )
//   }
// }
