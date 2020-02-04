export class ColumnMappingValue {
  constructor(table, column, value, func, args) {
    this.field = {table: table, column: column};
    this.value = value;
    this.function = func;
    this.args = args;
  }

  newField() {
    return new ColumnMappingValue('', '', '', '', [])
  }

  newValue() {
    return new ColumnMappingValue('', '', '', '', [])
  }

  newFunction() {
    return new ColumnMappingValue('', '', '', '', [new ColumnMappingValue().newField()])
  }

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
