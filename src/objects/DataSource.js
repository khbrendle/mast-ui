// const xid = require('xid-js');
// import 'xid-js';

import { newDataLocation } from "./DataLocation.js"

export class DataSource {
  constructor(type, select, from, location, filter, operations, level, alias) {
    // 'query', 'subquery', or 'table'
    // default 'table'
    this.type = type === undefined ? null : type;
    // list of columns to select from the source
	  // only used in query or subquery
    this.select = select === undefined ? [] : select;
    // from is used for subqueries and queries
    // should be a DataSource object
    this.from = from === undefined ? null : from;
    // describes a table location; database, schema, table, and alias
    // should be a DataLocation object
    this.location = location === undefined ? {} : location;
    // any filters that need to be applied in a query/subquery
    this.filter = filter === undefined ? null : filter;
    // operation describes how to join or union another source
    // array of DataSourceOperation
    this.operations = operations === undefined ? [] : operations;
    // level is the nesting level, just used for pretty printing SQL
    // not necessary to implement in front-end
    this.level = level === undefined ? 0 : level;
    // table alias should be a very unique name to be able to differentiate sources in a query
    this.alias = alias === undefined ? null : alias;
  }

  newDataSource(type) {
    switch (type) {
      case "table":
        return new DataSource("table", [], null, newDataLocation());
      case "query":
        return new DataSource("query", [], {});
      default:
        return new DataSource();
    }
  }
  newDataSourceQuery(from) {
    return new DataSource("query", [], from)
  }

  setType(type) {
    this.type = type
    return this
  }

  // this function will see if a location has been initialized and initialize if needed
  checkLocation() {
    if (this.location === null || this.location === undefined) {
      console.log("setting new data location");
      this.location = newDataLocation()
    }
  }

  setLocationDatabase(database) {
    this.checkLocation()
    this.location.database = database
    return this
  }
  setLocationTable(table) {
    this.checkLocation()
    this.location.table = table
    return this
  }

  fromObject(o) {
    return new DataSource(
      o.type === undefined ? '' : o.type,
      Object.keys(o).includes("is_arg") ? o.is_arg : '',
      Object.keys(o).includes("select") ? o.select.map((v) => { return new FieldTransform().fromObject(v) }) : [],
      Object.keys(o).includes("from") ?  new DataSource().fromObject(o.from) : {},
      Object.keys(o).includes("location") ?  new DataLocation().fromObject(o.location) : {},
      // this will need to be updated
      Object.keys(o).includes("filter") ?  o.filter : null,
      Object.keys(o).includes("operations") ?  o.operations.map((k) => { return new DataSourceOperation().fromObject(k) }) : [],
      Object.keys(o).includes("level") ?  o.level : null,
      Object.keys(o).includes("alias") ?  o.alias : null
    );
  }
  toString() {
    var r = this;
    var i;
    for (i = 0; i < this.select.length; i++) {
      r.select[i] = this.select[i].deleteFieldOptions();
    }
    return JSON.stringify(r, null, 2)
  }
}

export const newDataSource = DataSource.prototype.newDataSource;
export const newDataSourceQuery = DataSource.prototype.newDataSourceQuery;
