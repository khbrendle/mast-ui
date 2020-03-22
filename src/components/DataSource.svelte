<script>
  import {
    DataSource,
    newDataSource,
    newDataSourceQuery
  } from "../objects/DataSource.js";
  import { newDataSourceOperation } from "../objects/DataSourceOperation.js";
  import { newOperationType } from "../objects/OperationType.js";
  import { syntaxHighlight, newRandomID } from "../utils/utils.js";
  import { getField, optionsCache } from "../utils/api.js";
  import {
    Col,
    Container,
    Row,
    Button,
    ButtonToolbar,
    Input,
    Label
  } from "sveltestrap";
  import { beforeUpdate } from "svelte";
  import DataLocation from "./DataLocation.svelte";
  import FieldSelections from "./FieldSelections.svelte";
  import OperationType from "./OperationType.svelte";

  let uniqID = newRandomID();

  let rowStyle = "border-style: dashed;border-color: black; border-width: 1px";

  export let props = newDataSource("table");
  $: props = props;

  // export let selected = [];
  // $: selected = selected;

  // allowed values
  export let allowedTables = [];
  $: allowedTables = allowedTables;
  export let allowedFields = [];
  $: allowedFields = allowedFields;

  const logObj = () => {
    console.log(`type is proper class ${props instanceof DataSource}`);
    console.log("props");
    console.log(props);
    // console.log("selected");
    // console.log(selected);
  };
  const hanldeJoinTable = () => {
    console.log("adding join");
  };

  let displaySelectFields = "none";
  // let tableKey = "";
  // $: tableKey = tableKey;
  // let tableFields = [];
  // $: tableFields = tableFields;
  let selected = [];
  $: selected = selected;
  const handleOpenSelectFields = () => {
    console.log("opening modal");
    // if no fields fetched then get the fields
    if (props.select.length === 0) {
      var fields;
      if (props.from.type === "query") {
        console.log("getting subquery selections");
        // fields = props.from.select;
        fields = props.getFields();
      } else {
        console.log("getting table fields");
        if (
          props.from.location.table_id === undefined ||
          props.from.location.table_id === "" ||
          props.from.location.table_id === null
        ) {
          alert("need to select a table");
          return;
        }
        console.log(`table_id ${props.from.location.table_id}`);
        getField({ table_id: props.from.location.table_id }).then(data => {
          props.tableKey = data[0];
          // console.log(tableFields);
        });
        fields = $optionsCache[props.tableKey];
      }
      if (fields === undefined) {
        fields = [];
      }
      props.selected = Array(fields.length).fill(false);
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
      // console.log("setting query");
      props = props.setType("query");
    }
    // console.log(`type is proper class ${props instanceof DataSource}`);
    props.operations = [
      ...props.operations,
      newDataSourceOperation(newOperationType("join"), newDataSource("query"))
    ];
    // console.log(`type is proper class ${props instanceof DataSource}`);
    console.log(props);
  };

  let operationTypeDisplay = "none";
  const handleJoinDetails = () => {
    if (allowedTables.length < 2) {
      alert("must select some tables");
    } else {
      operationTypeDisplay = "block";
    }
  };

  const handleWrap = () => {
    // console.log(`type is proper class ${props instanceof DataSource}`);
    props = props.wrapQuery();
    // selected = [];
  };

  const handleLog = () => {
    console.log(props);
  };

  let fields = [];
  // $: fields = fields;
  let loadedFields = false;

  beforeUpdate(() => {
    var correct = props instanceof DataSource;
    // console.log(`type is proper class ${correct}`);
    if (!correct) {
      console.log(props);
    }
    allowedTables = props.getTableIDs();

    if (props.from !== null) {
      if (props.from.type === "table") {
        fields = $optionsCache[props.tableKey];
      } else {
        // fields = props.from.select;
        fields = props.getFields();
      }
    }
    // if (!loadedFields) {
    //   console.log("setting table fields");
    //   if (props.tableKey !== null) {
    //     fields = $optionsCache[props.tableKey];
    //   }
    //   // else {
    //   //   fields = props.from.select;
    //   // }
    //   loadedFields = true;
    // }

    // console.log("allowedTables");
    // console.log(allowedTables);
  });

  let addUnionBtnStyle =
    "width: 100%; height: 20px; font-size:10px; margin-right:6px;";
  let addJoinBtnStyle = "font-size: 10px; height: 124px; width: 6%";
</script>

<!-- <div style="padding: 8px; border: 1px dashed purple;"> <!--  min-width: 630px; -->

<div style="padding: 8px; border: 1px dashed blue; overflow: scroll; flex-wrap: nowrap; min-width: 400px;"> <!--  min-width: 630px; -->

<!-- type 'query' -->
  {#if props.type === "query"}
  <div style="display: flex;">
    <!-- <Button class="float-right add-join-btn" style={addJoinBtnStyle} title="Add Join" on:click={handleAddJoin}>add<br>join</Button> -->
    <Col style="padding: 6px; border: 1px dashed red; max-width: 93%; display: table;">
    <div>
      <Button class="float-right" size="sm" on:click={handleWrap}>wrap</Button>
      <Button class="float-right" size="sm" on:click={handleLog}>log</Button>
      <ButtonToolbar size="sm">
        <select class="form-control-sm" bind:value={props.type} style="width: 150px; display: inline;">
          <option value="table">Table</option>
          <option value="query">Query</option>
        </select>
        <Button class="float-none add-union-btn" size="sm" display="display: inline;"on:click={handleOpenSelectFields}>select fields</Button>
      </ButtonToolbar>
      <FieldSelections id={`field-selections-${uniqID}`} bind:selections={props.select} bind:selected={props.selected} bind:fields={fields} bind:display={displaySelectFields}/>
    </div>
    <!-- <DataLocation bind:props={props.location} /> -->
    <svelte:self bind:props={props.from} />
    </Col>
    <Button class="float-right add-join-btn" style={addJoinBtnStyle} title="Add Join" on:click={handleAddJoin}>add<br>join</Button>
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

<!-- type 'table' -->

  {:else}
  <Button class="float-right" size="sm" on:click={handleWrap}>wrap</Button>
  <DataLocation bind:props={props.location} />
  {/if}

</div>
<!-- joins -->
{#each props.operations as e}
  {#if e.type.method === "join"}
    <Button style="margin: 5px;" on:click={handleJoinDetails}>join<br>details</Button>
    <OperationType bind:display={operationTypeDisplay} bind:props={e.type} bind:allowedFields={allowedFields} bind:allowedTables={allowedTables}/>
    <svelte:self bind:props={e.source} />
  {/if}
{/each}

<!-- </div> -->
