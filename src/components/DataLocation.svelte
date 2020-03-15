<script>
  import { onMount } from "svelte";
  import { getDatabase, getTable, getField } from "../utils/api.js";
  import { newDataLocation } from "../objects/DataLocation.js";
  import { Col, Container, Row, Button, Input, Label } from "sveltestrap";

  export let props = newDataLocation();
  $: props = props;

  const handleSelectDatabase = e => {
    console.log("selecting database");
    // set database
    // props.database = e.target.value;
    var id = e.target.options[e.target.selectedIndex].id;
    // console.log(`database_id ${id}`);
    // get tables
    props.database_id = id;
    getTable({ database_id: id }).then(data => {
      tables = data;
    });
  };
  const handleSelectTable = e => {
    console.log("selecting table");
    props.table_id = e.target.options[e.target.selectedIndex].id;
    props.table = e.target.value;
  };

  let databases = [];
  $: databases = databases;
  let tables = [];
  $: tables = tables;
  onMount(() => {
    getDatabase().then(data => {
      databases = data;
    });
  });
</script>

<!-- select database -->
<div style="display: inline-flex;">
<div style="padding-right: 5px;">
  <Label for="database-select" style="display: inline; width: 250px;">Database</Label><br>
  <select class="form-control" id="database-select" on:input={handleSelectDatabase} bind:value={props.database} style="display: inline; width: 250px; margin: unset;">
    <option disabled selected value> select a database </option>
    {#each databases as db}
      <option id={db.database_id} value={db.database_name}>
        {db.database_name}
      </option>
    {/each}
  </select>
</div>
<!-- select table based on database -->
<div style="padding-left: 5px;">
  <Label for="table-select" style="display: inline; width: 250px;">Table</Label><br>
  <select class="form-control" id="table-select" on:input={handleSelectTable} style="display: inline; width: 250px; margin: unset;">
    <option disabled selected value> select a table </option>
    {#each tables as tbl}
      <option id={tbl.table_id} value={tbl.table_name}>
        {tbl.table_name}
      </option>
    {/each}
  </select>
  </div>
</div>
