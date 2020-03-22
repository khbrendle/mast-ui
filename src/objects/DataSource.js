import { DataLocation, newDataLocation } from "./DataLocation.js"

export class DataSource {
  constructor(type, select, from, location, filter, operations, level, alias, selected, tableKey) {
    // 'query', 'subquery', or 'table'
    // default 'table'
    this.type = type === undefined ? null : type;
    // list of columns to select from the source
	  // only used in query or subquery
    this.select = select === undefined ? [] : select;
    // from is used for subqueries and queries
    // should be a DataSource object
    this.from = from === undefined ? {} : from;
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
    this.tableKey = tableKey === undefined ? null : tableKey;
  }

  newDataSource(type) {
    switch (type) {
      case "table":
        return new DataSource("table", [], null, newDataLocation());
      case "query":
        return new DataSource("query", [], newDataSource("table"));
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

  wrapQuery() {
    console.log(this.select);
    return new DataSource("query", [], this)
  }

  getTableIDs() {
    var r = [];
    var c;
    if (this.location.table_id !== null & this.location.table_id !== "") {
      r.push(this.location.table_id)
    }
    // must be instance of DataSource to be able to call the method
    if (this.from instanceof DataSource) {
      // console.log("getting IDs from 'from'");
      r = r.concat(this.from.getTableIDs())
    }
    var i;
    for (i = 0; i < this.operations.length; i++) {
      c = this.operations[i].source instanceof DataSource;
      // console.log(`operation ${i} is DataSource ${c}`);
      r = r.concat(this.operations[i].source.getTableIDs())
    }
    return r;
  }

  // this function will see if a location has been initialized and initialize if needed
  checkLocation() {
    if (this.location === null || this.location === undefined) {
      // console.log("setting new data location");
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
    console.log(o);
    return new DataSource(
      o.type === undefined ? '' : o.type,
      Object.keys(o).includes("is_arg") ? o.is_arg : '',
      Object.keys(o).includes("select") ? o.select.map((v) => { return new FieldTransform().fromObject(v) }) : [],
      Object.keys(o).includes("from") ?  o.from !== null ? new DataSource().fromObject(o.from) : {} : {},
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
    return JSON.stringify(this, null, 2)
  }

  getFields() {
    var r = [];
    r = r.concat(this.select);
    if (this.from !== null) {
      r = r.concat(this.from.getFields());
    }
    if (this.operations.length > 0) {
      var i;
      for (i = 0; i < this.operations.length; i++) {
        r = r.concat(this.operations[i].source.getFields());
      }
    }
    return r;
  }
}

export const newDataSource = DataSource.prototype.newDataSource;
export const newDataSourceQuery = DataSource.prototype.newDataSourceQuery;
