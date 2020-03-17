<script>
  import ColumnMappingComponent from "./ColumnMappingComponent.svelte";
  import { FieldTransform } from "./objects/FieldTransform.js";
  import { onMount, afterUpdate } from "svelte";
  // 3 level nesting
  // let input =
  //   '{"type":"Function","field":{"table":"","column":""},"value":"","function":"f.concat","args":[{"type":"Function","field":{"table":"","column":""},"value":"","function":"f.lit","args":[{"type":"Value","field":{"table":"","column":""},"value":"static text","function":"","args":[]}]}]}';

  // let input = `{"type":"Function","is_arg":false,"arg_index":null,"field":{"table":"","table_id":"","column":"","column_id":""},"value":"","function":"concat","args":[{"type":"Field","is_arg":true,"arg_index":0,"field":{"table":"actor","table_id":"bp0ad6jipt375iprc410","column":"first_name","column_id":"bp0ad6jipt375iprc1h0"},"value":"","function":"","args":[]},{"type":"Field","is_arg":true,"arg_index":1,"field":{"table":"actor","table_id":"bp0ad6jipt375iprc410","column":"last_name","column_id":"bp0ad6jipt375iprc1hg"},"value":"","function":"","args":[]}]}`;

  // let input = `{"type":"Value","value":"some text"}`;
  // start empty
  var input = "";
  let child_value =
    input === "" ? new FieldTransform() : new FieldTransform().fromJSON(input);
  $: child_value = child_value; // this will make sure the value gets updated on change

  const handleLog = () => {
    console.log(child_value);
  };
</script>

<!--
  this component contains the column transformation builder
-->
<button type="button" on:click|preventDefault={handleLog}>log</button>
<ColumnMappingComponent bind:props={child_value} />
<!-- <div>{@html "<pre>" + JSON.stringify(child_value, null, 2) + "</pre>"}</div> -->
<!-- <pre>{@html child_value.print()}</pre> -->
<pre>{child_value.toString(null, 2)}</pre>
