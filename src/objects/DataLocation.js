export class DataLocation {
  constructor(database, database_id, schema, table, table_id, alias) {
    this.database = database === undefined ? "" : database;
    this.database_id = database_id === undefined ? "" : database_id;
    this.schema = schema === undefined ? "" : schema;
    this.table = table === undefined ? "" : table;
    this.table_id = table_id === undefined ? "" : table_id;
    this.alias = alias === undefined ? null : alias;
  }

  newDataLocation(database, schema, table, alias) {
    return new DataLocation(database, null, schema, table, null, alias);
  }

  fromObject(o) {
    return new DataLocation(
      Object.keys(o).includes("database") ? o.database : '',
      Object.keys(o).includes("database_id") ? o.database_id : '',
      Object.keys(o).includes("schema") ? o.schema : '',
      Object.keys(o).includes("table") ? o.table : '',
      Object.keys(o).includes("table_id") ? o.table_id : '',
      Object.keys(o).includes("alias") ? o.alias : ''
    );
  }
}

export const newDataLocation = DataLocation.prototype.newDataLocation;
