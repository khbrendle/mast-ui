// const xid = require('xid-js');

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
    return new DataLocation(database,  schema, table, alias);
  }
}

export const newDataLocation = DataLocation.prototype.newDataLocation;
