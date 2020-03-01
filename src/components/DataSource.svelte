<script>
  import { newDataSource, newDataSourceQuery } from "../objects/DataSource.js";
  import { newDataSourceOperation } from "../objects/DataSourceOperation.js";
  import { syntaxHighlight } from "../utils/utils.js";
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
</script>

<Row>
  {#if props.type === "query"}
    <FieldSelections bind:props={props.select} />
  {/if}
  <DataLocation bind:props={props.location} />
</Row>
