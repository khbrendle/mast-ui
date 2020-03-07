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

  const logObj = () => {
    console.log(props);
  };
  const hanldeJoinTable = () => {
    console.log("adding join");
  };
  const handleAddUnion = () => {
    console.log("adding union");
    props.operations = [...props.operations, newDataSourceOperation("union")];
  };
  const handleAddJoin = () => {
    console.log("adding join");
  };
  const handleChangeType = e => {
    props.type = e.target.value;
    console.log(props);
  };

  let displaySelectFields = "none";
  let tableFields = [];
  $: tableFields = tableFields;
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
        console.log(tableFields);
      });
    }
    displaySelectFields = "block";
  };

  let addUnionBtnStyle =
    "width: 100%; height: 20px; font-size:10px; margin-right:6px;";
  let addJoinBtnStyle = "font-size: 10px; height: 80px; margin-bottom: 8px;";
</script>

<!-- <Col style="margin: 8px 8px 8px 0px; padding: 6px 6px 0px 6px; border-style: dashed;border-color: red; border-width: 1px"> -->
  <!-- <Button class="float-right add-join-btn" style={addJoinBtnStyle} title="Add Join" on:click={handleAddJoin}>add<br>join</Button> -->
  <Row>
    <Input type="select" on:change={handleChangeType} style="width: 150px;">
      <option value="table">Table</option>
      <option value="query">Query</option>
    </Input>
    {#if props.type === "query"}
      <Button class="float-none add-union-btn" on:click={handleOpenSelectFields}>Select Fields</Button>
      <FieldSelections bind:fields={tableFields} bind:display={displaySelectFields}/>
    {/if}
    <DataLocation bind:props={props.location} />
  </Row>
  <!-- <Button class="float-none add-union-btn" style={addUnionBtnStyle} on:click={handleAddUnion}>add union</Button>
</Col> -->
