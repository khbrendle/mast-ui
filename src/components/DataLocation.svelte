<script>
  import { beforeUpdate } from "svelte";
  import { getDatabase, getTable, getField, optionsCache } from "../utils/api.js";
  import { newDataLocation } from "../objects/DataLocation.js";
  import { Col, Container, Row, Button, Input, Label } from "sveltestrap";

  let init = true;

  export let props = newDataLocation();
  $: props = props;

  const handleSelectDatabase = e => {
    console.log("selecting database");
    // set database
    props.database_id = e.target.options[e.target.selectedIndex].id;
    // get tables
    getTable({ database_id: props.database_id }).then(data => {
      tableKey = data[0];
    });
  };
  const handleSelectTable = e => {
    console.log("selecting table");
    props.table_id = e.target.options[e.target.selectedIndex].id;
    // props.table = e.target.value;
  };

  let databaseKey = "";
  $: databaseKey = databaseKey;
  let tableKey = "";
  $: tableKey = tableKey;

  beforeUpdate(() => {
    if (init) {
      console.log("initializing DataLocation");
      getDatabase().then(data => {
        databaseKey = data[0];
      });

      if (
        props.table_id !== "" ||
        props.table_id !== null ||
        props.table_id !== undefined
      ) {
        getTable({ database_id: props.database_id }).then(data => {
          tableKey = data[0];
        });
      }

      init = false;
    }
  });
</script>

<!-- select database -->
<div style=""> <!--display: inline-flex;-->
<div style="padding-right: 5px;">
  <Label for="database-select" style="display: inline; width: 250px;">Database</Label><br>
  <select class="form-control" id="database-select" on:change|preventDefault={handleSelectDatabase} bind:value={props.database} style="display: inline; width: 250px; margin: unset;">
    <option disabled selected value> select a database </option>
    {#if databaseKey !== ""}
    {#each $optionsCache[databaseKey] as db}
      <option selected={db.database_id === props.database_id} id={db.database_id} value={db.database_name}>
        {db.database_name}
      </option>
    {/each}
    {/if}
  </select>
</div>
<!-- select table based on database -->
<div style="padding-left: 5px;">
  <Label for="table-select" style="display: inline; width: 250px;">Table</Label><br>
  <select class="form-control" id="table-select" on:change|preventDefault={handleSelectTable} bind:value={props.table} style="display: inline; width: 250px; margin: unset;">
    <option disabled selected value> select a table </option>
    {#if tableKey !== ""}
    {#each $optionsCache[tableKey] as tbl}
      <option selected={tbl.table_id === props.table_id} id={tbl.table_id} value={tbl.table_name}>
        {tbl.table_name}
      </option>
    {/each}
    {/if}
  </select>
  </div>
</div>
