import {writable, get} from "svelte/store"

export let optionsCache = writable({})

const parseArgs = (args) => {
  // console.log("args: ", args);
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

  // console.log("x: ", x);
  // check if we already have the data
  var exists = Object.keys(get(optionsCache)).includes(x)
  // console.log(`key '${x}' exists in cache: ${exists}`);
  if (exists) {
    // if so just return
    var res = get(optionsCache)[x]
    return [x, res]
  }
  // set the variable to be referenced by other objects
  optionsCache.update(s => {
    s[x] = [];
    return s;
  })
  // database_id=bp0ad6jipt375iprc3ug&table_id=bp0ad6jipt375iprc3v0
  let host = `http://localhost:3000/v0`
  let route = `/database${x}`
  let q = await fetch(`${host}${route}`);
  var res = await q.json();
  // set result in cache for next use
  optionsCache.update(s => {
    s[x] = res;
    return s;
  })
  // return table results
  // console.log("res:", res);
  return [x, res];
}

// get list of tables for a database
export async function getTable(args) {
  console.log("getting tables");
  // args should be object where key is the query parameter and value is the query
  var x = parseArgs(args);

  console.log("x: ", x);
  // check if we already have the data
  var exists = Object.keys(get(optionsCache)).includes(x)
  console.log(`key '${x}' exists in cache: ${exists}`);
  if (exists) {
    // if so just return
    var res = get(optionsCache)[x]
    return [x, res]
  }
  // set the variable to be referenced by other objects
  optionsCache.update(s => {
    s[x] = [];
    return s;
  })
  // if we don't yet have the data then request from API
  let host = `http://localhost:3000/v0`
  let route = `/table${x}`
  let q = await fetch(`${host}${route}`);
  var res = await q.json();
  // set result in cache for next use
  optionsCache.update(s => {
    s[x] = res;
    return s;
  })
  return [x, res];
}

// get list of fields for a table
export async function getField(args) {
  // console.log("getting fields");
  // args should be object where key is the query parameter and value is the query
  var x = parseArgs(args)

  // console.log("x: ", x);
  // check if we already have the data
  var exists = Object.keys(get(optionsCache)).includes(x)
  // console.log(`key '${x}' exists in cache: ${exists}`);
  if (exists) {
    // if so just return
    var res = get(optionsCache)[x]
    return [x, res]
  }
  // init
  optionsCache.update(s => {
    s[x] = [];
    return s;
  })
  // database_id=bp0ad6jipt375iprc3ug&table_id=bp0ad6jipt375iprc3v0
  let host = `http://localhost:3000/v0`
  let route = `/field${x}`
  let q = await fetch(`${host}${route}`);
  // set the variable to be referenced by other objects
  var res = await q.json();
  // console.log("result", res);
  // set result in cache for next use
  optionsCache.update(s => {
    s[x] = res;
    return s;
  })
  // console.log("cache:", get(optionsCache));
  return [x, res];
}
