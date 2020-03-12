<script>
  import { newDataSource, newDataSourceQuery } from "../objects/DataSource.js";
  import { newDataSourceOperation } from "../objects/DataSourceOperation.js";
  import { syntaxHighlight } from "../utils/utils.js";
  import { getField } from "../utils/api.js";
  import { Col, Container, Row, Button, Input, Label } from "sveltestrap";
  import DataLocation from "./DataLocation.svelte";
  import FieldSelections from "./FieldSelections.svelte";

  let rowStyle = "border-style: dashed;border-color: black; border-width: 1px";

  export let props = newDataSource("table");
  $: props = props;

  // export let selected = [];
  // $: selected = selected;

  const logObj = () => {
    console.log("props");
    console.log(props);
    // console.log("selected");
    // console.log(selected);
  };
  const hanldeJoinTable = () => {
    console.log("adding join");
  };

  let displaySelectFields = "none";
  let tableFields = [];
  $: tableFields = tableFields;
  let selected = [];
  $: selected = selected;
  const handleOpenSelectFields = () => {
    console.log("opening modal");
    // if no fields fetched then get the fields
    if (props.select.length === 0) {
      if (
        props.location.table_id === undefined ||
        props.location.table_id === ""
      ) {
        alert("need to select a table");
        return;
      }
      console.log(`table_id ${props.location.table_id}`);
      getField({ table_id: props.location.table_id }).then(data => {
        tableFields = data;
        // console.log(tableFields);
      });
      selected = Array(tableFields.length).fill(false);
    }
    displaySelectFields = "block";
  };

  const handleAddUnion = () => {
    console.log("adding union");
    props = props.setType("query");

    props.operations = [
      ...props.operations,
      newDataSourceOperation("union", newDataSource("query"))
    ];
  };
  const handleAddJoin = () => {
    console.log("adding join");
  };

  let addUnionBtnStyle =
    "width: 100%; height: 20px; font-size:10px; margin-right:6px;";
  let addJoinBtnStyle = "font-size: 10px; height: 124px;";
</script>

<!-- <Col style="margin: 8px 8px 8px 0px; padding: 6px 6px 0px 6px; border-style: dashed;border-color: red; border-width: 1px"> -->
  <div>
  <Button class="float-right add-join-btn" style={addJoinBtnStyle} title="Add Join" on:click={handleAddJoin}>add<br>join</Button>
  <Col style="margin: 8px 8px 8px 0px; padding: 6px 6px 0px 6px; border-style: dashed;border-color: red; border-width: 1px; max-width: 95%;">
  <!-- <Button class="float-right add-join-btn" style={addJoinBtnStyle} title="Add Join" on:click={handleAddJoin}>add<br>join</Button> -->
    <div>
      <select class="form-control" bind:value={props.type} style="width: 150px; display: inline;">
        <option value="table">Table</option>
        <option value="query">Query</option>
      </select>
      {#if props.type === "query"}
        <Button class="float-none add-union-btn" display="display: inline;"on:click={handleOpenSelectFields}>Select Fields</Button>
        <FieldSelections bind:selections={props.select} bind:selected={selected} bind:fields={tableFields} bind:display={displaySelectFields}/>
      {/if}
    </div>
    <DataLocation bind:props={props.location} />
    <!-- <Button class="float-none add-union-btn" style={addUnionBtnStyle} on:click={handleAddUnion}>add union</Button> -->
    </Col>
  </div>
<!-- </Col> -->
<Button class="float-none add-union-btn" style={addUnionBtnStyle} on:click={handleAddUnion}>add union</Button>
<div style='border: 1px dashed green; padding: 10px;'>
  {#each props.operations as e}
      <svelte:self bind:props={e.source} />
  {/each}
</div>
