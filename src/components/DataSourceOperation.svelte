<script>
  import { newDataSource, newDataSourceQuery } from "../objects/DataSource.js";
  import { newDataSourceOperation } from "../objects/DataSourceOperation.js";
  import { syntaxHighlight } from "../utils/utils.js";
  import { getField, optionsCache } from "../utils/api.js";
  import { Col, Container, Row, Button, Input, Label } from "sveltestrap";
  import DataLocation from "./DataLocation.svelte";
  import FieldSelections from "./FieldSelections.svelte";

  export let props = newDataSourceOperation("query");
  $: props = props;

  let fieldKey = "";
  $: fieldKey = fieldKey;

  // allowed values
  export let allowedTables = [];
  $: allowedTables = allowedTables;
  export let allowedFields = [];
  $: allowedFields = allowedFields;

  let displaySelectFields = "none";
  const handleOpenSelectFields = () => {
    console.log("opening modal");
    if (props.source.location.table_id === undefined) {
      alert("need to select a table");
      return;
    }
    console.log(`table_id ${props.source.location.table_id}`);
    getField({ table_id: props.source.location.table_id }).then(data => {
      // console.log(data);
      fieldKey = data[0];
    });
    displaySelectFields = "block";
  };

  let addUnionBtnStyle =
    "width: 100%; height: 20px; font-size:10px; margin-right:6px;";
</script>

<Row>
  <Button class="float-none add-union-btn" style={addUnionBtnStyle} on:click={handleOpenSelectFields}>Select Fields</Button>
  <FieldSelections bind:selections={props.source.select} bind:fields={$optionsCache[fieldKey]} bind:display={displaySelectFields} bind:allowedTables={allowedTables} bind:allowedFields={allowedFields}/>
  <DataLocation bind:props={props.source.location} />
</Row>
