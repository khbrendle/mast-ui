import { syntaxHighlight } from "./utils.js"

export class ColumnMappingValue {
  constructor(type, isArg, argIndex, table, column, value, func, args) {
    // console.log("start constructing");
    this.type = type === undefined ? 'Field' : type; // defaulting to field
    this.isArg = isArg === undefined ? false : isArg;
    this.argIndex = argIndex === undefined ? null : argIndex;
    this.field = {
      table: table === undefined ? '' : table,
      column: column === undefined ? '' : column
    };
    this.value = value === undefined ? '' : value;
    this.function = func === undefined ? '' : func;
    this.args = args === undefined ? [] : args;
    // $: this.args = this.args
    // console.log("end constructing: ", this)
  }
  // create new field object
  // mostly used to reset if object type is changed
  newField (idx) {
    console.log("creating new field object");
    return new ColumnMappingValue('Field',
    idx === undefined ? false : true,
    idx === undefined ? null : idx, '', '', '', '', [])
  }
  // create new value object
  // mostly used to reset if object type is changed
  newValue (idx) {
    console.log("creating new value object");
    return new ColumnMappingValue('Value', idx === undefined ? false : true,
    idx === undefined ? null : idx, '', '', '', '', [])
  }
  // create new function object
  // mostly used to reset if object type is changed
  newFunction (idx) {
    console.log(`creating new function object with index ${idx}`);
    return new ColumnMappingValue('Function',
      idx === undefined ? false : true,
      idx === undefined ? null : idx, '', '', '', '', [new ColumnMappingValue().newField(0)])
  }
  // create wrapper around an object
  // this just pushes the current object into an argument of an un-named function
  newWrapper (isArg, argsIndex, prop) {
    console.log("creating new wrapper object for type ", prop.type);
    console.log("input instance of Array? ", prop instanceof Array)
    console.log("input instance of ColumnMappingValue? ", prop instanceof ColumnMappingValue)
    prop.isArg = true
    prop.argIndex = 0
    return new ColumnMappingValue('Function', isArg, argsIndex, '', '', '', '', [prop])
  }
  fromJSON (x) {
    console.log("creating object from string");
    let o = JSON.parse(x);
    return new ColumnMappingValue().fromObject(o)
  }
  fromObject (o) {
    console.log("creating object from js object");
    return new ColumnMappingValue(
      o.type === undefined ? '' : o.type,
      o.isArg === undefined ? false : o.isArg,
      o.argIndex === undefined ? null : o.argIndex,
      o.field.table === undefined ? '' : o.field.table,
      o.field.column === undefined ? '' : o.field.column,
      o.value === undefined ? '' : o.value,
      o.function === undefined ? '' : o.function,
      o.args === undefined ? [] : o.args.map( x => new ColumnMappingValue().fromObject(x))
    )

  }
  // this method is used to move a function arguemnt up the list (from 2nd to 1st argument)
  moveArgUp (idx) { // where idx is the index we want to move
    // can't move the first object up
    if (idx > 0) {
      // splice args at idx removing sinlge value into temp object
      // the value moved into tmp is the one we want to move
      this.args[idx].argIndex -= 1
      this.args[idx-1].argIndex += 1
      var tmp = this.args.splice(idx, 1)
      // after we have extracted the value, placeit back into the args array at a higher index
      this.args.splice(idx-1, 0, tmp[0])
    }
    return this
  }
  moveArgDown (idx) {
    // can't move the last object down
    if (idx+1 < this.args.length) {
      // splice args at idx removing sinlge value into temp object
      // the value moved into tmp is the one we want to move
      this.args[idx+1].argIndex -= 1
      this.args[idx].argIndex += 1
      var tmp = this.args.splice(idx, 1)
      // after we have extracted the value, placeit back into the args array at a higher index
      this.args.splice(idx+1, 0, tmp[0])
    }
    return this
  }

  // based on a type, initialize the correct values and reset any that may have existed
  fromType(type, idx) {
    console.log(`got index ${idx} in new ColumnMappingValue().fromType()`)
    switch (type) {
      case 'Field':
        return new ColumnMappingValue().newField(idx)
      case 'Value':
        return new ColumnMappingValue().newValue(idx)
      case 'Function':
        return new ColumnMappingValue().newFunction(idx)
    }
  }

  toString(replacer = null, spacing = 2) {
    return JSON.stringify(this, replacer, spacing)
  }

  print() {
    return syntaxHighlight(this.toString(null, 2))
  }
}

export class TableMappingValue {

}
