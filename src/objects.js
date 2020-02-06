export class ColumnMappingValue {
  constructor(type, table, column, value, func, args) {
    // console.log("start constructing");
    this.type = type === undefined ? 'Field' : type; // defaulting to field
    this.field = {
      table: table === undefined ? '' : table,
      column: column === undefined ? '' : column
    };
    this.value = value === undefined ? '' : value;
    this.function = func === undefined ? '' : func;
    this.args = args === undefined ? [] : args;
    // console.log("end constructing: ", this)
  }
  // create new field object
  // mostly used to reset if object type is changed
  newField () {
    console.log("creating new field object");
    return new ColumnMappingValue('Field', '', '', '', '', [])
  }
  // newBlank () {
  //   console.log("creating new blank object");
  //   return new ColumnMappingValue('', '', '', '', '', [])
  // }
  // create new value object
  // mostly used to reset if object type is changed
  newValue () {
    console.log("creating new value object");
    return new ColumnMappingValue('Value', '', '', '', '', [])
  }
  // create new function object
  // mostly used to reset if object type is changed
  newFunction () {
    console.log("creating new function object");
    return new ColumnMappingValue('Function', '', '', '', '', [new ColumnMappingValue().newField()])
  }
  // create wrapper around an object
  // this just pushes the current object into an argument of an un-named function
  newWrapper (arg) {
    console.log("creating new wrapper object for type ", arg.type);
    console.log("input instance of Array? ", arg instanceof Array)
    console.log("input instance of ColumnMappingValue? ", arg instanceof ColumnMappingValue)
    return new ColumnMappingValue('Function', '', '', '', '', [arg])
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
      o.field.table === undefined ? '' : o.field.table,
      o.field.column === undefined ? '' : o.field.column,
      o.value === undefined ? '' : o.value,
      o.function === undefined ? '' : o.function,
      o.args === undefined ? [] : o.args.map( x => new ColumnMappingValue().fromObject(x))
    )

  }

  // based on a type, initialize the correct values and reset any that may have existed
  fromType(type) {
    switch (type) {
      case 'Field':
        return new ColumnMappingValue().newField()
      case 'Value':
        return new ColumnMappingValue().newValue()
      case 'Function':
        return new ColumnMappingValue().newFunction()
    }
  }
}
