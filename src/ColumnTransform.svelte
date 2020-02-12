<script>
  import ColumnMappingComponent from "./ColumnMappingComponent.svelte";
  import { ColumnMappingValue } from "./objects.js";
  // 3 level nesting
  // let input =
  //   '{"type":"Function","field":{"table":"","column":""},"value":"","function":"f.concat","args":[{"type":"Function","field":{"table":"","column":""},"value":"","function":"f.lit","args":[{"type":"Value","field":{"table":"","column":""},"value":"static text","function":"","args":[]}]}]}';
  let input = `{"type":"Function","isArg":false,"argIndex":null,"field":{"table":"","column":""},"value":"","function":"","args":[{"type":"Field","isArg":true,"argIndex":0,"field":{"table":"person","column":"first_name"},"value":"","function":"","args":[]},{"type":"Field","isArg":true,"argIndex":1,"field":{"table":"person","column":"last_name"},"value":"","function":"","args":[]}]}`;
  // start empty
  // var input = "";
  let child_value =
    input === ""
      ? new ColumnMappingValue()
      : new ColumnMappingValue().fromJSON(input);
  $: child_value = child_value; // this will make sure the value gets updated on change
</script>

<!--
  this component contains the column transformation builder
-->

<ColumnMappingComponent bind:props={child_value} />
<p> child value<br> </p>
<!-- <div>{@html "<pre>" + JSON.stringify(child_value, null, 2) + "</pre>"}</div> -->
<!-- <pre>{@html child_value.print()}</pre> -->
<pre>{child_value.toString(null, 2)}</pre>
