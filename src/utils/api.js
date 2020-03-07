import { ObjectCache } from "./object_cache.js"

const parseArgs = (args) => {
  console.log(args);
  if (args !== undefined) {
    var res = []
    Object.entries(args).forEach(([k, v]) => res.push(`${k}=${v}`))
    res = `?${res.join("&")}`
  } else {
    var res = ""
  }
  return res
}

// get list of databases
export async function getDatabase(args) {
  // args should be object where key is the query parameter and value is the query
  var x = parseArgs(args);

  // parse database cache object
  var databaseCache = new ObjectCache().fromString(sessionStorage.getItem('databaseCache'));
  // console.log(`cache object`, databaseCache);
  // check if we already have the data
  var exists = databaseCache.exists(x);
  console.log(`key '${x}' exists in cache: ${exists}`);
  if (exists) {
    // if so just return
    var res = databaseCache.get(x)
    // need to save again to update the hit_count
    sessionStorage.setItem('databaseCache', databaseCache.toString());
    return res
  }
  // database_id=bp0ad6jipt375iprc3ug&table_id=bp0ad6jipt375iprc3v0
  let q = await fetch(`http://localhost:3000/v0/database${x}`);
  var res = await q.json();
  // set result in cache for next use
  databaseCache.set(x, res)
  // save cache in storage
  sessionStorage.setItem('databaseCache', databaseCache.toString());
  // return table results
  return res;
}

// get list of tables for a database
export async function getTable(args) {
  // args should be object where key is the query parameter and value is the query
  var x = parseArgs(args);

  // parse table cache object
  var tableCache = new ObjectCache().fromString(sessionStorage.getItem('tableCache'));
  // console.log(`cache object`, tableCache);
  // check if we already have the data
  var exists = tableCache.exists(x);
  console.log(`key '${x}' exists in cache: ${exists}`);
  if (exists) {
    // if so just return
    var res = tableCache.get(x)
    // need to save again to update the hit_count
    sessionStorage.setItem('tableCache', tableCache.toString());
    return res
  }
  // if we don't yet have the data then request from API
  let q = await fetch(`http://localhost:3000/v0/table${x}`);
  var res = await q.json();
  // set result in cache for next use
  tableCache.set(x, res)
  // save cache in storage
  sessionStorage.setItem('tableCache', tableCache.toString());
  // return table results
  return res;
}

// get list of fields for a table
export async function getField(args) {
  // args should be object where key is the query parameter and value is the query
  var x = parseArgs(args)

  // parse table cache object
  var fieldCache = new ObjectCache().fromString(sessionStorage.getItem('fieldCache'));
  // console.log(`cache object`, tableCache);
  // check if we already have the data
  var exists = fieldCache.exists(x);
  console.log(`key '${x}' exists in cache: ${exists}`);
  if (exists) {
    // if so just return
    var res = fieldCache.get(x)
    // need to save again to update the hit_count
    sessionStorage.setItem('fieldCache', fieldCache.toString());
    return res
  }
  // database_id=bp0ad6jipt375iprc3ug&table_id=bp0ad6jipt375iprc3v0
  let q = await fetch(`http://localhost:3000/v0/field${x}`);
  var res = await q.json();
  // set result in cache for next use
  fieldCache.set(x, res)
  // save cache in storage
  sessionStorage.setItem('fieldCache', fieldCache.toString());
  // return table results
  return res;
}
