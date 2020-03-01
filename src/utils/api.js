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

  // database_id=bp0ad6jipt375iprc3ug&table_id=bp0ad6jipt375iprc3v0
  let q = await fetch(`http://localhost:3000/v0/database${x}`);
  let res = await q.json();
  return res;
}

// get list of tables for a database
export async function getTable(args) {
  // args should be object where key is the query parameter and value is the query
  var x = parseArgs(args);
  console.log(args);

  let q = await fetch(`http://localhost:3000/v0/table${x}`);
  let res = await q.json();
  return res;
}

// get list of fields for a table
export async function getField(args) {
  // args should be object where key is the query parameter and value is the query
  var x = parseArgs(args)
  console.log(x);
  // database_id=bp0ad6jipt375iprc3ug&table_id=bp0ad6jipt375iprc3v0
  let q = await fetch(`http://localhost:3000/v0/field${x}`);
  let res = await q.json();
  return res;
}
