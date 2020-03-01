import { newDataSource } from './DataSource.js'

export class DataSourceOperation {
  constructor(type, source, level) {
    // 'union' or 'join'
    this.type = type === undefined ? "" : type;
    // DataSource obejct, can be query, subquery, or table
    this.source = source === undefined ? newDataSource(type) : source;
    // nesting level for pretty-printing
    // not necessary to implement in front-end
    this.level = level === undefined ? 0 : level;
  }

  newDataSourceOperation(type, source, level) {
    return new DataSourceOperation(type, source, level);
  }

}

export const newDataSourceOperation = DataSourceOperation.prototype.newDataSourceOperation;
