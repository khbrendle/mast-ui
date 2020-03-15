// const xid = require('xid-js');
// import 'xid-js';

import { DataLocation, newDataLocation } from "./DataLocation.js"

export class DataSource {
  constructor(type, select, from, location, filter, operations, level, alias, selected) {
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
    this.location = location === undefined ? new DataLocation() : location;
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
    // for front-end use only to hold state information
    this.selected = selected === undefined ? [] : selected;
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

  fromJSON(j) {
    var x = JSON.parse(j);
    return new DataSource().fromObject(x);
  }

  copy() {
    var j = JSON.stringify(this);
    return new DataSource().fromJSON(j);
  }

  toString() {
    var r = this;
    var i, i2;
    for (i = 0; i < r.select.length; i++) {
      r.select[i] = r.select[i].deleteFieldOptions();
    }
    for (i = 0; i < r.operations.length; i++) {
      if (r.operations[i].type.method === "join") {
        for (i2 = 0; i2 < r.operations[i].type.join_on.length; i2++) {
          r.operations[i].type.join_on[i2].entity = r.operations[i].type.join_on[i2].entity.deleteFieldOptions();
        }
      }
    }
    // delete r.selected
    return JSON.stringify(r, null, 2)
  }
}

export const newDataSource = DataSource.prototype.newDataSource;
export const newDataSourceQuery = DataSource.prototype.newDataSourceQuery;
