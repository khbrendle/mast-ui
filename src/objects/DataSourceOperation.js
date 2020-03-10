import { DataSource, newDataSource } from './DataSource.js';
import { OperationType, newOperationType} from './OperationType.js';

export class DataSourceOperation {
  constructor(type, source, level) {
    // 'union' or 'join'
    this.type = type === undefined ? {} : type;
    // DataSource obejct, can be query, subquery, or table
    this.source = source === undefined ? newDataSource(type) : source;
    // nesting level for pretty-printing
    // not necessary to implement in front-end
    this.level = level === undefined ? 0 : level;
  }

  newDataSourceOperation(type, source, level) {
    return new DataSourceOperation(type, source, level);
  }

  fromObject(o) {
    return new DataSourceOperation(
      Object.keys(o).includes("type") ?  new OperationType().fromObject(o.type) : {},
      Object.keys(o).includes("source") ?  new DataSource().fromObject(o.source) : {},
      Object.keys(o).includes("level") ?  o.level : null
    )
  }

}

export const newDataSourceOperation = DataSourceOperation.prototype.newDataSourceOperation;
