import { syntaxHighlight } from "../utils/utils.js"

export class FieldTransform {
  constructor(type, is_arg, arg_index, table, table_id, column, column_id, value, func, args) {
    // console.log("start constructing");
    this.type = type === undefined ? 'Field' : type; // defaulting to field
    this.is_arg = is_arg === undefined ? false : is_arg;
    this.arg_index = arg_index === undefined ? null : arg_index;
    this.field = {
      table: table === undefined ? '' : table,
      table_id: table_id === undefined ? '' : table_id,
      column: column === undefined ? '' : column,
      column_id: column_id === undefined ? '' : column_id
    };
    this.value = value === undefined ? '' : value;
    this.function = func === undefined ? '' : func;
    this.args = args === undefined ? [] : args;
    // $: this.args = this.args
    // console.log("end constructing: ", this)
  }
  // create new field object
  // mostly used to reset if object type is changed
  newFieldTransform (idx) {
    console.log("creating new field object");
    return new FieldTransform('Field',
    idx === undefined ? false : true,
    idx === undefined ? null : idx, '', '', '', '', [])
  }
  newField (idx) {
    console.log("creating new field object");
    return new FieldTransform('Field',
    idx === undefined ? false : true,
    idx === undefined ? null : idx, '', '', '', '', [])
  }
  // create new value object
  // mostly used to reset if object type is changed
  newValue (idx) {
    console.log("creating new value object");
    return new FieldTransform('Value', idx === undefined ? false : true,
    idx === undefined ? null : idx, '', '', '', '', '', '', [])
  }
  // create new function object
  // mostly used to reset if object type is changed
  newFunction (idx) {
    console.log(`creating new function object with index ${idx}`);
    return new FieldTransform('Function',
      idx === undefined ? false : true,
      idx === undefined ? null : idx, '', '', '', '', '', '', [new FieldTransform().newField(0)])
  }
  // create wrapper around an object
  // this just pushes the current object into an argument of an un-named function
  newWrapper (is_arg, argsIndex, prop) {
    console.log("creating new wrapper object for type ", prop.type);
    console.log("input instance of Array? ", prop instanceof Array)
    console.log("input instance of FieldTransform? ", prop instanceof FieldTransform)
    prop.is_arg = true
    prop.arg_index = 0
    return new FieldTransform('Function', is_arg, argsIndex, '', '', '', '', '', '', [prop])
  }
  fromJSON (x) {
    console.log("creating object from string");
    let o = JSON.parse(x);
    console.log(o);
    return new FieldTransform().fromObject(o)
  }
  fromObject (o) {
    console.log("creating object from js object");
    let x = new FieldTransform(
      o.type === undefined ? '' : o.type,
      Object.keys(o).includes("is_arg") ? o.is_arg : '',
      Object.keys(o).includes("arg_index") ? o.arg_index : '',
      Object.keys(o).includes("field") ? Object.keys(o.field).includes("table") ? o.field.table : '' : '',
      Object.keys(o).includes("field") ? Object.keys(o.field).includes("table_id") ? o.field.table_id : '' : '',
      Object.keys(o).includes("field") ? Object.keys(o.field).includes("column") ? o.field.column : '' : '',
      Object.keys(o).includes("field") ? Object.keys(o.field).includes("column_id") ? o.field.column_id : '' : '',
      Object.keys(o).includes("value") ? o.value : '',
      Object.keys(o).includes("function") ? o.function : '',
      Object.keys(o).includes("args") ? o.args.map( x => new FieldTransform().fromObject(x)) : []
    );
    console.log("completed creating object");
    return x
  }
  // this method is used to move a function arguemnt up the list (from 2nd to 1st argument)
  moveArgUp (idx) { // where idx is the index we want to move
    // can't move the first object up
    if (idx > 0) {
      // splice args at idx removing sinlge value into temp object
      // the value moved into tmp is the one we want to move
      this.args[idx].arg_index -= 1
      this.args[idx-1].arg_index += 1
      var tmp = this.args.splice(idx, 1)
      // after we have extracted the value, place it back into the args array at a higher index
      this.args.splice(idx-1, 0, tmp[0])
    }
    return this
  }
  moveArgDown (idx) {
    // can't move the last object down
    if (idx+1 < this.args.length) {
      // splice args at idx removing sinlge value into temp object
      // the value moved into tmp is the one we want to move
      this.args[idx+1].arg_index -= 1
      this.args[idx].arg_index += 1
      var tmp = this.args.splice(idx, 1)
      // after we have extracted the value, placeit back into the args array at a higher index
      this.args.splice(idx+1, 0, tmp[0])
    }
    return this
  }

  // based on a type, initialize the correct values and reset any that may have existed
  fromType(type, idx) {
    console.log(`got index ${idx} in new FieldTransform().fromType()`)
    switch (type) {
      case 'Field':
        return new FieldTransform().newField(idx)
      case 'Value':
        return new FieldTransform().newValue(idx)
      case 'Function':
        return new FieldTransform().newFunction(idx)
    }
  }

  toString(replacer = null, spacing = 2) {
    return JSON.stringify(this, replacer, spacing)
  }

  print() {
    return syntaxHighlight(this.toString(null, 2))
  }
}
