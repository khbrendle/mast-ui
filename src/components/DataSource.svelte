<script>
  import { newDataSource, newDataSourceQuery } from "../objects/DataSource.js";
  import { newDataSourceOperation } from "../objects/DataSourceOperation.js";
  import { newOperationType } from "../objects/OperationType.js";
  import { syntaxHighlight } from "../utils/utils.js";
  import { getField, optionsCache } from "../utils/api.js";
  import { Col, Container, Row, Button, Input, Label } from "sveltestrap";
  import DataLocation from "./DataLocation.svelte";
  import FieldSelections from "./FieldSelections.svelte";
  import OperationType from "./OperationType.svelte";

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
  let tableKey = "";
  $: tableKey = tableKey;
  // let tableFields = [];
  // $: tableFields = tableFields;
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
        tableKey = data[0];
        // console.log(tableFields);
      });
      selected = Array($optionsCache[tableKey].length).fill(false);
    }
    displaySelectFields = "block";
  };

  const handleAddUnion = () => {
    console.log("adding union");
    props = props.setType("query");

    props.operations = [
      ...props.operations,
      newDataSourceOperation(newOperationType("union"), newDataSource("query"))
    ];
  };
  const handleAddJoin = () => {
    console.log("adding join");
    if (props.type !== "query") {
      props = props.setType("query");
    }

    props.operations = [
      ...props.operations,
      newDataSourceOperation(newOperationType("join"), newDataSource("query"))
    ];
  };

  let operationTypeDisplay = "none";
  const handleJoinDetails = () => {
    operationTypeDisplay = "block";
  };

  let addUnionBtnStyle =
    "width: 100%; height: 20px; font-size:10px; margin-right:6px;";
  let addJoinBtnStyle = "font-size: 10px; height: 124px; width: 6%";
</script>

<Col style="padding: 8px; border: 1px dashed blue; min-width: 630px;">
  {#if props.type === "query"}
  <div>
    <Button class="float-right add-join-btn" style={addJoinBtnStyle} title="Add Join" on:click={handleAddJoin}>add<br>join</Button>
    <Col style="padding: 6px; border: 1px dashed red; max-width: 93%;">
    <div>
      <select class="form-control" bind:value={props.type} style="width: 150px; display: inline;">
        <option value="table">Table</option>
        <option value="query">Query</option>
      </select>
      {#if props.type === "query"}
        <Button class="float-none add-union-btn" display="display: inline;"on:click={handleOpenSelectFields}>Select Fields</Button>
        <FieldSelections bind:selections={props.select} bind:selected={selected} bind:fields={$optionsCache[tableKey]} bind:display={displaySelectFields}/>
      {/if}
    </div>
    <DataLocation bind:props={props.location} />
    </Col>
  </div>
  <Button class="float-none add-union-btn" style={addUnionBtnStyle} on:click={handleAddUnion}>add union</Button>
  <!-- unions -->
  {#if props.operations.length > 0}
  <div style='border: 1px dashed green; padding: 10px; overflow: scroll; flex-wrap: nowrap; display: flex'>
    {#each props.operations as e}
        {#if e.type.method === "union"}
          <svelte:self bind:props={e.source} />
        {/if}
    {/each}
  </div>
  {/if}
  {:else}
  <DataLocation bind:props={props.location} />
  {/if}
</Col>
<!-- joins -->
{#each props.operations as e}
  {#if e.type.method === "join"}
    <Button style="margin: 5px;" on:click={handleJoinDetails}>join<br>details</Button>
    <OperationType bind:display={operationTypeDisplay} bind:props={e.type} />
    <svelte:self bind:props={e.source} />
  {/if}
{/each}
