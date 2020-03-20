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
  let host = `http://localhost:3000/v0`
  let route = `/database${x}`

  // console.log("x: ", x);
  // check if we already have the data
  var exists = Object.keys(get(optionsCache)).includes(x)
  console.log(`key '${route}' exists in cache: ${exists}`);
  if (exists) {
    // if so just return
    var res = get(optionsCache)[route]
    if (res !== undefined) {
      return [route, res]
    }
    return [route, []]
  }
  // set the variable to be referenced by other objects
  console.log("initializing cache object");
  optionsCache.update(s => {
    s[route] = [];
    return s;
  })
  let q = await fetch(`${host}${route}`);
  var res = await q.json();
  // set result in cache for next use
  optionsCache.update(s => {
    s[route] = res;
    return s;
  })
  // return table results
  // console.log("res:", res);
  return [route, res];
}

// get list of tables for a database
export async function getTable(args) {
  console.log("getting tables");
  // args should be object where key is the query parameter and value is the query
  var x = parseArgs(args);
  let host = `http://localhost:3000/v0`
  let route = `/table${x}`

  // console.log("x: ", route);
  // check if we already have the data
  var exists = Object.keys(get(optionsCache)).includes(x)
  console.log(`key '${route}' exists in cache: ${exists}`);
  if (exists) {
    // if so just return
    var res = get(optionsCache)[route]
    if (res !== undefined) {
      return [route, res]
    }
    return [route, []]
  }
  // set the variable to be referenced by other objects
  console.log("initializing cache object");
  optionsCache.update(s => {
    s[route] = [];
    return s;
  })
  // if we don't yet have the data then request from API
  let q = await fetch(`${host}${route}`);
  var res = await q.json();
  // set result in cache for next use
  optionsCache.update(s => {
    s[route] = res;
    return s;
  })
  return [route, res];
}

// get list of fields for a table
export async function getField(args) {
  // console.log("getting fields");
  // args should be object where key is the query parameter and value is the query
  var x = parseArgs(args)
  let host = `http://localhost:3000/v0`
  let route = `/field${x}`

  // console.log("x: ", x);
  // check if we already have the data
  var exists = Object.keys(get(optionsCache)).includes(x)
  console.log(`key '${route}' exists in cache: ${exists}`);
  if (exists) {
    // if so just return
    var res = get(optionsCache)[route]
    if (res !== undefined) {
      return [route, res]
    }
    return [route, []]
  }
  // init
  console.log("initializing cache object");
  optionsCache.update(s => {
    s[route] = [];
    return s;
  })
  let q = await fetch(`${host}${route}`);
  // set the variable to be referenced by other objects
  var res = await q.json();
  // console.log("result", res);
  // set result in cache for next use
  optionsCache.update(s => {
    s[route] = res;
    return s;
  })
  console.log("cache:", get(optionsCache));
  return [route, res];
}
